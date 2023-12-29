import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const MoveToChatScreen = () => {
    navigation.navigate('Chat');
  };
  return (
    <ImageBackground
      style={styles.imageContainer}
      source={require('../assets/images/WelcomeBackground.png')}>
      <Image
        style={styles.robotImage}
        source={{uri: 'https://media.tenor.com/CigpzapemsoAAAAi/hi-robot.gif'}}
      />
      <Text style={styles.welcomeText}>
        {"Welcome!\nI'm berry the chat bot."}
      </Text>
      <TouchableOpacity onPress={MoveToChatScreen} style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Let's chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.chatButton, {marginTop: hp(2)}]}>
        <Text style={styles.chatButtonText}>History</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  robotImage: {
    height: hp(40),
    width: wp(80),
    resizeMode: 'cover',
    marginTop: hp(25),
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: hp(3),
    color: '#008AF7',
    fontWeight: 'bold',
    paddingLeft: wp(16),
    marginTop: hp(5),
  },
  chatButton: {
    paddingVertical: hp(1),
    paddingHorizontal: hp(2),
    backgroundColor: '#008AF7',
    borderRadius: 8,
    width: wp(30),
    alignSelf: 'center',
    marginTop: hp(5),
    alignItems: 'center',
  },
  chatButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});
