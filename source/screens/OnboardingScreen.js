import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Platform,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// DUMMY DATA
import { DUMMY_DATA } from '../dummy-data';
const onboardingData = DUMMY_DATA;

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 720;
const isAndroid = Platform.OS === 'android';

const OnboardingScreen = (props) => {
  // NOTE: SCROLL VALUE
  const scrollX = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  // NOTE: BUTTON FUNCTION
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef();
  function currentPageIndex(event) {
    const getIndex = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(getIndex / width);
    setCurrentIndex(pageIndex);
  }
  function goToNextIndex() {
    const nextIndex = currentIndex + 1;
    const offset = nextIndex * width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentIndex(nextIndex);
  }
  function skipIndex() {
    const lastIndex = onboardingData.length - 1;
    const offset = lastIndex * width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentIndex(lastIndex);
  }
  function goToHomeScreen() {
    Alert.alert('Welcome to Home Screen');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.FlatList
        ref={ref}
        data={onboardingData}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={currentPageIndex}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          // NOTE: ANIMATIONS
          // MAIN IMAGE ANIMATION
          const animImageMain = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: ['90deg', '0deg', '-90deg'],
          });
          // SMALL IMAGE 1 ANIMATION
          const animImageSmall1 = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0, 1, 0],
          });
          const animImageSmall1X = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [-100, 0, 100],
          });
          const animImageSmall1Y = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [100, 0, 100],
          });
          // SMALL IMAGE 2 ANIMATION
          const animImageSmall2 = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0, 1, 0],
          });
          const animImageSmall2X = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [-100, 0, 100],
          });
          const animImageSmall2Y = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [-100, 0, -100],
          });
          // TEXT ANIMATION
          const animTitle = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [200, 0, -200],
          });
          const animDescription = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [100, 0, -100],
          });
          const opacity = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0, 1, 0],
          });

          // MARK: CONTENT
          return (
            <View key={index} style={{ width: width }}>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.imageContainer}>
                  <Animated.Image
                    source={item.imageSmall1}
                    style={[
                      styles.imageSmall1,
                      {
                        transform: [
                          { scale: animImageSmall1 },
                          { translateX: animImageSmall1X },
                          { translateY: animImageSmall1Y },
                        ],
                      },
                    ]}
                  />
                  <Animated.Image
                    source={item.imageSmall2}
                    style={[
                      styles.imageSmall2,
                      {
                        transform: [
                          { scale: animImageSmall2 },
                          { translateX: animImageSmall2X },
                          { translateY: animImageSmall2Y },
                        ],
                      },
                    ]}
                  />
                  <Animated.Image
                    source={item.imageMain}
                    style={[
                      styles.imageMain,
                      { transform: [{ rotate: animImageMain }] },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.paddingImageHeight} />
                  <Animated.Text
                    style={[
                      styles.title,
                      {
                        transform: [{ translateX: animTitle }],
                        opacity: opacity,
                      },
                    ]}
                  >
                    {item.title}
                  </Animated.Text>
                  <Animated.Text
                    style={[
                      styles.description,
                      {
                        transform: [{ translateX: animDescription }],
                        opacity: opacity,
                      },
                    ]}
                  >
                    {item.description}
                  </Animated.Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* MARK: INDICATOR */}
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const animDotScale = currentIndex === index ? 1.3 : 1;
          const animOpacity = currentIndex === index ? 1 : 0.5;
          return (
            <View key={index}>
              <View
                style={[
                  styles.dotsIndicator,
                  {
                    opacity: animOpacity,
                    transform: [{ scale: animDotScale }],
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* MARK: BUTTON */}
      <View>
        {currentIndex === onboardingData.length - 1 ? (
          <TouchableOpacity
            style={styles.buttonStartContainer}
            onPress={goToHomeScreen}
          >
            <View style={styles.buttonStartBackground}>
              <Text style={styles.buttonText}>Get Started</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={skipIndex}
            >
              <View style={styles.buttonSkipBackground}>
                <Text style={styles.buttonSkipText}>Skip</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={goToNextIndex}
            >
              <View style={styles.buttonBackground}>
                <Text style={styles.buttonText}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ImageBackground
        source={require('../assets/onboardingBackground.jpg')}
        style={styles.imageBackground}
      />
    </View>
  );
};

// FIXME: REAL DEVICES NEED TO BE READJUSTED
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C70505',
  },

  // MARK: IMAGE STYLE
  imageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height / 12,
  },
  imageMain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 0,
  },
  imageSmall1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 1,
  },
  imageSmall2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 2,
  },

  // MARK: TEXT STYLE
  textContainer: {
    paddingHorizontal: 40,
  },
  paddingImageHeight: {
    height: height / 1.75,
  },
  title: {
    fontFamily: 'BANGERS400',
    fontSize: 50,
    color: '#FFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'POPPINS400',
    fontSize: 16,
    color: '#FFF',
    lineHeight: 30,
    textAlign: 'center',
  },

  // MARK: INDICATOR STYLE
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: height / 6.3,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 5,
  },

  // MARK: BUTTON STYLE
  buttonStartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 5,
  },
  buttonStartBackground: {
    width: '80%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    paddingHorizontal: 5,
  },
  buttonBackground: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'BANGERS400',
    color: '#C70505',
    fontSize: 32,
  },
  buttonSkipBackground: {
    width: '100%',
    height: 60,
    backgroundColor: '#C70505',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  buttonSkipText: {
    fontFamily: 'BANGERS400',
    color: '#FFF',
    fontSize: 32,
  },

  // MARK: IMAGE BACKGROUND STYLE
  imageBackground: {
    width: width,
    height: height,
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: -1,
  },
});

export default OnboardingScreen;
