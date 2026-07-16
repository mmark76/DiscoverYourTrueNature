export type InputModality = 'keyboard' | 'pointer';

export function isFocusVisible(
  focused: boolean,
  isWeb: boolean,
  inputModality: InputModality,
) {
  return focused && (!isWeb || inputModality === 'keyboard');
}
