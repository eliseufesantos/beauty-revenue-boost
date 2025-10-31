import { useEffect, useRef, useState } from 'react';

type SoundType = 'good' | 'neutral' | 'milestone' | 'completion';

interface SoundEffect {
  play: () => void;
  frequency?: number;
  duration?: number;
}

export const useSoundEffects = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('eucalyptus_audio_preference');
    return saved === 'muted';
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context on first interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Initialize on first user interaction
    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('touchstart', initAudioContext, { once: true });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem('eucalyptus_audio_preference', newValue ? 'muted' : 'unmuted');
      return newValue;
    });
  };

  const playSound = (type: SoundType) => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    try {
      switch (type) {
        case 'good':
          // Resposta Boa: Tom ascendente 800Hz
          playTone(ctx, 800, 0.2, 0.3, now);
          break;

        case 'neutral':
          // Resposta Neutra/Ruim: Tom descendente 400Hz
          playTone(ctx, 400, 0.2, 0.25, now);
          break;

        case 'milestone':
          // Progresso 50%: Acorde C-E-G
          playChord(ctx, [523, 659, 784], 0.3, 0.35, now);
          break;

        case 'completion':
          // 100% completo: Acorde mais celebratório
          playChord(ctx, [523, 659, 784, 1047], 0.4, 0.4, now);
          break;
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  };

  // Helper function to play a single tone
  const playTone = (
    ctx: AudioContext,
    frequency: number,
    duration: number,
    volume: number,
    startTime: number
  ) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // ADSR Envelope
    const attackTime = type === 'good' ? 0.01 : 0.02;
    const decayTime = type === 'good' ? 0.05 : 0.06;
    const sustainTime = type === 'good' ? 0.1 : 0.08;
    const releaseTime = 0.04;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + attackTime + decayTime);
    gainNode.gain.setValueAtTime(volume * 0.7, startTime + attackTime + decayTime + sustainTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  // Helper function to play a chord (multiple notes)
  const playChord = (
    ctx: AudioContext,
    frequencies: number[],
    duration: number,
    volume: number,
    startTime: number
  ) => {
    frequencies.forEach((freq, index) => {
      const delay = index * 0.05; // 50ms between each note
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume / frequencies.length, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
      }, delay * 1000);
    });
  };

  return {
    playSound,
    isMuted,
    toggleMute,
  };
};
