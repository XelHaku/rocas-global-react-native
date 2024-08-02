import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { getChat } from '@/utils/openai/getChat';

type MessageType = { id: string; text: string; isUser: boolean };

const ChatMessage = ({ message, isUser }: { message: string; isUser: boolean }) => {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.messageBubble, 
      isUser ? [styles.userMessage, { backgroundColor: colors.primary }] : [styles.aiMessage, { backgroundColor: colors.card }]
    ]}>
      <Text style={[
        styles.messageText, 
        isUser ? { color: '#FFFFFF' } : { color: colors.text }
      ]}>{message}</Text>
    </View>
  );
};

export default function TabOneScreen() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const flatListRef = useRef<FlatList<MessageType>>(null);
  const { colors, dark } = useTheme();
  const backgroundColor = dark ? '#000000' : '#FFFFFF';

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const startConversation = async () => {
    setConversationStarted(true);
    setIsLoading(true);
    const userMessage: MessageType = { id: Date.now().toString(), text: "Hola", isUser: true };
    setMessages([userMessage]);

    try {
      const response = await getChat("Hola");
      const aiMessage: MessageType = { id: Date.now().toString(), text: response, isUser: false };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      const errorMessage: MessageType = { id: Date.now().toString(), text: "Lo siento, hubo un error al iniciar la conversación. Por favor, intenta de nuevo.", isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage: MessageType = { id: Date.now().toString(), text: inputText, isUser: true };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        const response = await getChat(inputText);
        const aiMessage: MessageType = { id: Date.now().toString(), text: response, isUser: false };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error al obtener respuesta:', error);
        const errorMessage: MessageType = { id: Date.now().toString(), text: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.", isUser: false };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
    
      {!conversationStarted ? (
        <View style={[styles.welcomeContainer, { backgroundColor }]}>
          <Image
            source={require('@/assets/images/chatbot.png')}
            style={[styles.botImage, { opacity: dark ? 0.7 : 1 }]}
          />
          <Text style={[styles.welcomeText, { color: colors.text }]}>¡Bienvenido! Estoy aquí para ayudarte.</Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>Presiona el botón para comenzar nuestra conversación.</Text>
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: colors.primary }]} 
            onPress={startConversation}
          >
            <Text style={styles.startButtonText}>¡Hola!</Text>
            <FontAwesome name="hand-o-up" size={24} color="#FFFFFF" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <ChatMessage message={item.text} isUser={item.isUser} />}
            keyExtractor={item => item.id}
            style={[styles.chatList, { backgroundColor }]}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
          />
          {isLoading && (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background + 'B3' }]}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: dark ? '#1A1A1A' : colors.card
              }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu mensaje aquí..."
              placeholderTextColor={colors.text + '80'}
              editable={!isLoading}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} disabled={isLoading} style={styles.sendButton}>
              <FontAwesome 
                name="send" 
                size={24} 
                color={isLoading ? colors.text + '40' : colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  botImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  iconStyle: {
    marginLeft: 10,
  },
  chatList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});