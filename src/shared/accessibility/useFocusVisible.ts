import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { InputModality, isFocusVisible } from './focusVisibility';

type ModalityListener = (modality: InputModality) => void;

let currentInputModality: InputModality = 'keyboard';
let listeningForInputModality = false;
const modalityListeners = new Set<ModalityListener>();

function updateInputModality(modality: InputModality) {
  if (currentInputModality === modality) return;

  currentInputModality = modality;
  modalityListeners.forEach((listener) => listener(modality));
}

function listenForInputModality() {
  if (
    listeningForInputModality
    || Platform.OS !== 'web'
    || typeof document === 'undefined'
  ) {
    return;
  }

  document.addEventListener('keydown', () => updateInputModality('keyboard'), true);
  document.addEventListener('pointerdown', () => updateInputModality('pointer'), true);
  document.addEventListener('mousedown', () => updateInputModality('pointer'), true);
  document.addEventListener('touchstart', () => updateInputModality('pointer'), true);
  listeningForInputModality = true;
}

export function useFocusVisible() {
  const [focused, setFocused] = useState(false);
  const [inputModality, setInputModality] = useState(currentInputModality);

  useEffect(() => {
    listenForInputModality();
    modalityListeners.add(setInputModality);

    return () => {
      modalityListeners.delete(setInputModality);
    };
  }, []);

  return {
    focusVisible: isFocusVisible(focused, Platform.OS === 'web', inputModality),
    hideFocus: () => setFocused(false),
    showFocus: () => setFocused(true),
  };
}
