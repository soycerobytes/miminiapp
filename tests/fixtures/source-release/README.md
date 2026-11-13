# Contratos históricos del origen

Snapshots del circuito original de aalexlpez/miminiapp, tomados antes de adaptar el destino. workflow-safety.test.ts sigue probando sus pins, permisos y defensas como contratos de origen; no son workflows activos. production-workflow-safety.test.ts audita todos los workflows reales de .github/workflows y la política efectiva del destino. La CLI antigua mantiene todas las publicaciones cerradas al leer la política de producción. No instalar estos fixtures como automatizaciones.
