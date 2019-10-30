import React, {useState, useEffect} from 'react';
import {Animated} from 'react-native';

import {Small, Original} from './styles';

const OriginalAnimated = Animated.createAnimatedComponent(Original);

export default function LazyImage({shouldLoad, smallSource, source, ratio}) {
  const opacity = new Animated.Value(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    //   if (shouldLoad) {
    //     setLoaded(true);
    //   }

    setTimeout(() => {
      if (shouldLoad) {
        setLoaded(true);
      }
    }, 1000);
  }, [shouldLoad]);

  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Small
      source={{uri: smallSource}}
      ratio={ratio}
      resizeMode="contain"
      blurRadius={2}>
      {loaded && (
        <OriginalAnimated
          style={{opacity}}
          source={{uri: source}}
          ratio={ratio}
          resizeMode="contain"
          onLoadEnd={handleAnimate}
        />
      )}
    </Small>
  );
}
