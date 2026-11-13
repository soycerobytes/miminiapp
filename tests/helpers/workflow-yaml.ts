import { parsers } from 'prettier/plugins/yaml';
type Value = string | number | boolean | null | Value[] | Mapping;
interface Mapping {
  [key: string]: Value;
}
interface YamlNode {
  type: string;
  value?: string;
  children?: YamlNode[];
  anchor?: unknown;
  tag?: unknown;
}

export function mapping(value: Value | undefined, label: string): Mapping {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}: expected a mapping`);
  }
  return value;
}

// Prettier is an existing direct dependency. Decode its YAML AST structurally so
// comments, quoting and key order cannot disguise an enabled publishing job.
// Unknown YAML constructs fail closed rather than being silently ignored.
function decode(node: YamlNode): Value {
  if (node.anchor || node.tag)
    throw new Error('YAML anchors and tags are not allowed');
  const children = node.children ?? [];
  switch (node.type) {
    case 'root':
      if (children.length !== 1)
        throw new Error('Exactly one YAML document is required');
      return decode(children[0]);
    case 'document': {
      const head = children.find((child) => child.type === 'documentHead');
      const body = children.find((child) => child.type === 'documentBody');
      if (head?.children?.length || !body)
        throw new Error('Unsupported YAML document');
      return decode(body);
    }
    case 'documentBody':
    case 'mappingKey':
    case 'mappingValue':
    case 'sequenceItem':
    case 'flowSequenceItem':
      if (children.length > 1) throw new Error('Unexpected YAML wrapper');
      return children.length === 0 ? null : decode(children[0]);
    case 'mapping':
    case 'flowMapping': {
      const result: Mapping = Object.create(null) as Mapping;
      for (const item of children) {
        if (!['mappingItem', 'flowMappingItem'].includes(item.type)) {
          throw new Error(`Unsupported mapping entry: ${item.type}`);
        }
        const [keyNode, valueNode] = item.children ?? [];
        if (!keyNode || !valueNode) throw new Error('Incomplete YAML mapping');
        const key = decode(keyNode);
        if (
          typeof key !== 'string' ||
          key === '<<' ||
          Object.hasOwn(result, key)
        ) {
          throw new Error('Duplicate or unsupported YAML key');
        }
        result[key] = decode(valueNode);
      }
      return result;
    }
    case 'sequence':
    case 'flowSequence':
      return children.map(decode);
    case 'plain':
      if (node.value === 'true') return true;
      if (node.value === 'false') return false;
      if (node.value === 'null' || node.value === '~') return null;
      if (/^\d+$/.test(node.value ?? '')) return Number(node.value);
      return node.value ?? '';
    case 'quoteSingle':
    case 'quoteDouble':
    case 'blockLiteral':
    case 'blockFolded':
      return node.value ?? '';
    default:
      throw new Error(`Unsupported YAML node: ${node.type}`);
  }
}

export async function parseYaml(source: string): Promise<Mapping> {
  // This bundled parser only consumes the source; Prettier's general Parser
  // interface also describes formatting options used by other parsers.
  const parse = parsers.yaml.parse as (
    text: string,
  ) => YamlNode | Promise<YamlNode>;
  const ast = await parse(source);
  return mapping(decode(ast), 'workflow');
}

export type { Value, Mapping };
