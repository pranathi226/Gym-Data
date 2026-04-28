import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const suggestions = [
  { id: '1', text: 'Create workout plan', icon: 'barbell' },
  { id: '2', text: 'Track calories', icon: 'nutrition' },
  { id: '3', text: 'Diet suggestions', icon: 'restaurant' },
  { id: '4', text: 'Progress report', icon: 'trending-up' },
];

const aiResponses: Record<string, string> = {
  'Create workout plan': "Great choice! 💪 Based on your profile, I'd recommend a **Push/Pull/Legs** split:\n\n🔴 Monday: Push (Chest, Shoulders, Triceps)\n🔴 Tuesday: Pull (Back, Biceps)\n🔴 Wednesday: Legs & Core\n🔴 Thursday: Rest\n🔴 Friday: Upper Body\n🔴 Saturday: Lower Body\n🔴 Sunday: Active Recovery\n\nWant me to detail any specific day?",
  'Track calories': "Sure! Here's your calorie summary for today 📊:\n\n✅ Breakfast: 450 kcal\n✅ Lunch: 600 kcal\n⏳ Pre-Workout: 150 kcal\n⏳ Dinner: 550 kcal\n\n📍 Total Target: 1,750 kcal\n📍 Consumed so far: 1,050 kcal\n📍 Remaining: 700 kcal\n\nYou're on track! Keep it up! 🎯",
  'Diet suggestions': "Here are some nutrition tips tailored for you 🥗:\n\n1. **Increase protein** to 1.6g per kg body weight\n2. Add **Greek yogurt** as a snack (high protein, low sugar)\n3. Swap white rice for **brown rice** or quinoa\n4. Have **almonds** (15-20) as an evening snack\n5. Stay hydrated: aim for **3-4 liters** of water daily 💧\n\nWould you like a complete meal plan?",
  'Progress report': "Here's your weekly progress summary 📈:\n\n🏋️ **Workouts Completed**: 5/6\n⚡ **Calories Burned**: 2,400 kcal\n📏 **Weight Change**: -0.3 kg\n💪 **Strength Gain**: +5% bench press\n🎯 **Goal Progress**: 72% complete\n\nYou're doing amazing! Consistency is key! 🔥",
};

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );
    animateDot(dot1, 0).start();
    animateDot(dot2, 200).start();
    animateDot(dot3, 400).start();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.aiBubble}>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
          <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const isAI = message.sender === 'ai';

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isAI ? styles.messageRowAI : styles.messageRowUser,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {isAI && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={14} color="#E53935" />
        </View>
      )}
      <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
        {isAI && <Text style={styles.aiLabel}>FitKart AI</Text>}
        <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isAI ? styles.aiTime : styles.userTime]}>
          {message.timestamp}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hi there! 👋 I'm your FitKart AI Assistant. I can help you with workout plans, calorie tracking, diet suggestions, and progress reports. How can I help you today?",
      sender: 'ai',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const response = aiResponses[text.trim()] || 
        "That's a great question! 🤔 Let me think about that...\n\nBased on your fitness profile, I'd recommend consulting with your trainer for a personalized approach. In the meantime, I can help you with workout plans, calorie tracking, or diet suggestions!\n\nFeel free to ask anything! 💪";
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
      setShowSuggestions(true);
    }, 1500);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  }, [messages, isTyping]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={16} color="#E53935" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerStatus}>
              {isTyping ? 'Typing...' : 'Online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Suggestion Chips */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Quick Actions</Text>
            <View style={styles.suggestionsGrid}>
              {suggestions.map((sug) => (
                <TouchableOpacity
                  key={sug.id}
                  style={styles.suggestionChip}
                  activeOpacity={0.8}
                  onPress={() => sendMessage(sug.text)}
                >
                  <Ionicons name={sug.icon as any} size={16} color="#E53935" />
                  <Text style={styles.suggestionText}>{sug.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything..."
            placeholderTextColor="#BBB"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={18} color={inputText.trim() ? '#FFF' : '#CCC'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowAI: {
    alignSelf: 'flex-start',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 14,
    maxWidth: '100%',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#E53935',
    borderTopRightRadius: 4,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: '#333',
  },
  userText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 8,
  },
  aiTime: {
    color: '#CCC',
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingLeft: 38,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
    padding: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AAA',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFF0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 15,
    color: '#1A1A2E',
    maxHeight: 80,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
