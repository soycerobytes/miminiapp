import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import EnvironmentFixture from '../../src/components/EnvironmentFixture';

describe('EnvironmentFixture', () => {
  it('provides a labelled input and hydrates without a submitted result', async () => {
    render(<EnvironmentFixture />);

    expect(
      screen.getByRole('textbox', { name: 'Etiqueta de prueba' }),
    ).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Restablecer' })).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/Etiqueta confirmada:/)).not.toBeInTheDocument();
    expect(await screen.findByTestId('environment-fixture')).toHaveAttribute(
      'data-hydrated',
      'true',
    );
  });

  it('shows the normalized label after a successful submission', async () => {
    const user = userEvent.setup();
    render(<EnvironmentFixture />);
    const input = screen.getByRole('textbox', { name: 'Etiqueta de prueba' });

    await user.type(input, '  Base   local  ');
    await user.click(screen.getByRole('button', { name: 'Comprobar' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Etiqueta confirmada: Base local',
    );
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    ['', 'Escribe una etiqueta.'],
    ['ab', 'Usa al menos 3 caracteres.'],
    ['a'.repeat(33), 'Usa como máximo 32 caracteres.'],
  ])(
    'announces an invalid input and associates the error: %j',
    async (value, message) => {
      const user = userEvent.setup();
      render(<EnvironmentFixture />);
      const input = screen.getByRole('textbox', { name: 'Etiqueta de prueba' });
      if (value) await user.type(input, value);

      await user.click(screen.getByRole('button', { name: 'Comprobar' }));

      expect(screen.getByRole('alert')).toHaveTextContent(message);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription(
        new RegExp(message.replace('.', '\\.')),
      );
      expect(input).toHaveFocus();
      expect(
        screen.queryByText(/Etiqueta confirmada:/),
      ).not.toBeInTheDocument();
    },
  );

  it('replaces an error with a valid result when the input is corrected', async () => {
    const user = userEvent.setup();
    render(<EnvironmentFixture />);
    const input = screen.getByRole('textbox', { name: 'Etiqueta de prueba' });

    await user.click(screen.getByRole('button', { name: 'Comprobar' }));
    await user.type(input, 'Corregida');
    await user.click(screen.getByRole('button', { name: 'Comprobar' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Etiqueta confirmada: Corregida',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it.each(['valid', 'invalid'])(
    'resets the %s state and returns focus to the input',
    async (state) => {
      const user = userEvent.setup();
      render(<EnvironmentFixture />);
      const input = screen.getByRole('textbox', { name: 'Etiqueta de prueba' });
      if (state === 'valid') await user.type(input, 'Base local');
      await user.click(screen.getByRole('button', { name: 'Comprobar' }));

      await user.click(screen.getByRole('button', { name: 'Restablecer' }));

      expect(input).toHaveValue('');
      expect(input).toHaveFocus();
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Etiqueta confirmada:/),
      ).not.toBeInTheDocument();
    },
  );

  it('renders markup-like input as text', async () => {
    const user = userEvent.setup();
    render(<EnvironmentFixture />);

    await user.type(
      screen.getByRole('textbox', { name: 'Etiqueta de prueba' }),
      '<b>Texto</b>',
    );
    await user.click(screen.getByRole('button', { name: 'Comprobar' }));

    const result = screen.getByRole('status');
    expect(result).toHaveTextContent('Etiqueta confirmada: <b>Texto</b>');
    expect(result.querySelector('b')).toBeNull();
  });
});
