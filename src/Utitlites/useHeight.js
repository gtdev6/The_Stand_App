import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

export function useHeight() {
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    const updateDimensions = () => {
      setScreenHeight(Dimensions.get('window').height);
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );

    // Cleanup the subscription on unmount
    return () => subscription?.remove();
  }, []);

  return screenHeight;
}
