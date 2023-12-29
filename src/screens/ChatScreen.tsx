// ChatScreen.tsx
import React, {useState, useEffect, useRef} from 'react'; // Import useRef
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {sendMesageDalleAsync, sendMessageAsync} from '../redux/thunks';
import {RootState} from '../redux/store';

const ChatScreen: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [inputText, setInputText] = useState<string>('');
  const [isDalleActive, setIsDalleActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for ScrollView

  const handleSendMessage = () => {
    if (inputText.trim() === '') {
      return;
    }

    // Dispatch user message as an object
    isDalleActive
      ? dispatch(
          sendMesageDalleAsync(
            {role: 'user', content: inputText},
            setIsLoading,
          ),
        )
      : dispatch(
          sendMessageAsync({role: 'user', content: inputText}, setIsLoading),
        );
    setInputText('');
  };

  // const renderMessages = () => {
  //   messages.map((message, index) => {
  //     if (message.content.startsWith('dalleImage')) {
  //     }
  //   });
  //   return messages.map((message, index) => (
  //     <View
  //       key={index}
  //       style={
  //         message.role === 'user' ? styles.userMessage : styles.botMessage
  //       }>
  //       <Text
  //         style={[
  //           styles.messageText,
  //           {color: message.role === 'user' ? '#fff' : '#004780'},
  //         ]}>
  //         {message.content}
  //       </Text>
  //     </View>
  //   ));
  // };

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <SafeAreaView style={styles.container}>
        <View style={styles.botView}>
          <Image source={require('../assets/images/chatScreenBot.gif')} />
          <View style={styles.switchView}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                styles.leftSwitchButton,
                {backgroundColor: isDalleActive ? '#fff' : '#008AF7'},
              ]}
              onPress={() => setIsDalleActive(false)}>
              <Image
                source={require('../assets/images/chatgpt.png')}
                style={styles.switchImg}
              />
              <Text
                style={[
                  styles.switchText,
                  {color: isDalleActive ? '#008AF7' : '#fff'},
                ]}>
                ChatGPT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchButton,
                styles.rightSwitchButton,
                {backgroundColor: isDalleActive ? '#008AF7' : '#fff'},
              ]}
              onPress={() => setIsDalleActive(true)}>
              <Image
                source={require('../assets/images/dalle.png')}
                style={styles.switchImg2}
              />
              <Text
                style={[
                  styles.switchText,
                  {color: isDalleActive ? '#fff' : '#008AF7'},
                ]}>
                DALL·E
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef} // Attach the ref to ScrollView
            style={styles.chatContainer}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }}>
            {messages.map((message, index) => {
              if (message.content.startsWith('dalleImage')) {
                return (
                  <View
                    key={index}
                    style={
                      message.role === 'user'
                        ? styles.userMessage
                        : styles.botMessage
                    }>
                    <Image
                      style={styles.imageMsg}
                      defaultSource={require('../assets/images/dalle.png')}
                      source={{uri: message.content.slice(13)}}
                    />
                  </View>
                );
              } else {
                return (
                  <View
                    key={index}
                    style={
                      message.role === 'user'
                        ? styles.userMessage
                        : styles.botMessage
                    }>
                    <Text
                      style={[
                        styles.messageText,
                        {color: message.role === 'user' ? '#fff' : '#004780'},
                      ]}>
                      {message.content}
                    </Text>
                  </View>
                );
              }
            })}
            {isLoading ? (
              <Image
                style={styles.loadingGif}
                source={{
                  uri: 'https://media.tenor.com/k3VfwdRd6cEAAAAi/loading-load.gif',
                }}
              />
            ) : null}
            <View style={{height: hp(2)}} />
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type here"
              value={inputText}
              onChangeText={text => setInputText(text)}
              style={styles.input}
              multiline={true}
              numberOfLines={4}
            />
            <TouchableOpacity onPress={handleSendMessage} disabled={isLoading}>
              <Image
                source={require('../assets/images/SendIcon.png')}
                tintColor={isLoading ? 'grey' : '#008AF7'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    backgroundColor: '#e5f4ff',
    flex: 1,
    padding: hp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(2),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#008AF7',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 10,
    marginBottom: hp(2),
    maxWidth: wp(70),
    borderBottomLeftRadius: 0,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#008AF7',
    padding: 10,
    borderRadius: 10,
    marginBottom: hp(2),
    maxWidth: wp(70),
    borderBottomRightRadius: 0,
  },
  messageText: {
    fontSize: wp(4),
  },
  botView: {
    paddingVertical: hp(1),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#008AF7',
  },
  switchView: {
    flexDirection: 'row',
    width: wp(80),
  },
  switchButton: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '50%',
    justifyContent: 'center',
    marginVertical: hp(2),
    paddingVertical: hp(0.5),
    borderColor: '#008AF7',
    borderRadius: 6,
    alignItems: 'center',
  },
  leftSwitchButton: {
    borderRightWidth: 0.5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightSwitchButton: {
    borderLeftWidth: 0.5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  switchText: {
    fontSize: wp(5),
    marginLeft: wp(1),
  },
  switchImg: {
    height: hp(3),
    width: hp(3),
  },
  switchImg2: {
    height: hp(2),
    width: hp(2),
  },
  imageMsg: {
    height: hp(25),
    width: hp(25),
    borderRadius: 8,
    resizeMode: 'contain',
  },
  input: {
    width: wp(80),
    fontSize: hp(2),
  },
  loadingGif: {
    height: hp(6),
    width: hp(6),
    marginBottom: hp(2),
    resizeMode: 'contain',
  },
});

export default ChatScreen;
