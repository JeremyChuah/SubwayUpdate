import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, SafeAreaView, Pressable } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat'
import uuid from 'react-native-uuid';
import axios from 'axios';

const baseURL = 'http://127.0.0.1:3000';

const ChatScreen = ({route}) => {

  const {station_name, time} = route.params

  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: uuid.v4(),
        text: `Hi, learn more about ${station_name} including nearby attarctions and how fast you can get there!`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'SubwayUpdate',
        },
      },
    ])
  }, [])

  const getAIMessage = async (chatMessages, detail_string) => {
    
    let apiMessage = chatMessages.map((message) => {
        let role = "";
        let content = message.text;
        if (message.user.name == 'SubwayUpdate') {
            role = "assistant"
        } else if (message.user.name == 'user') {
            role = "user"
            content = content + " " + detail_string
        }

        return {role: role, content: content}
    })


    const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          ...apiMessage
        ]
    }

    await axios.post(`${baseURL}/chat`, {userMessage: apiRequestBody})
    .then(response => {
      const newUserMessage = {
        _id: uuid.v4(),
        text: response.data.content,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'SubwayUpdate',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, newUserMessage));
    })
  }

const onSend = useCallback( async (newMessages = []) => {
  const userMessage = newMessages[0].text;

  // Add user's message to state
  const newUserMessage = {
    _id: uuid.v4(),
    text: userMessage,
    createdAt: new Date(),
    user: {
      _id: 1,
      name: 'user',
    },
  };

  // Update messages state with the user's new message
  let updatedMessages = []
  setMessages(previousMessages => updatedMessages = GiftedChat.append(previousMessages, newUserMessage));

  // Prepare station details
  const station_details = `. Answer what user asks for but if they talk about a station or time, User is asking about ${station_name} station and a train will arrive at the station at ${new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`;

  // Call getAIMessage with the updated messages
  await getAIMessage(updatedMessages, station_details);

}, []);

  return (
    <SafeAreaView className="flex-1">
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    </SafeAreaView>
  )
}

export default ChatScreen;