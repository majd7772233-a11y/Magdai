import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

import {GlassCard} from '../../components/ui';
import {modelStore, chatSessionStore} from '../../store';
import {ROUTES} from '../../utils/navigationConstants';
import {l10n} from '../../locales';
import {uiStore} from '../../store';

export const HomeScreen: React.FC = observer(() => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const currentL10n = l10n[uiStore.language] || l10n.en;
  const isDark = theme.dark;

  const activeModel = modelStore.activeModel;
  const sessions = chatSessionStore.sessions.slice(0, 3);

  const navigateToChat = (options?: {persona?: string; topic?: string}) => {
    navigation.navigate(ROUTES.CHAT, options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return currentL10n.home?.greetingMorning || 'صباح الخير، مجد';
    if (hour < 18) return currentL10n.home?.greetingAfternoon || 'مساء الخير، مجد';
    return currentL10n.home?.greeting || 'مساء الخير، مجد';
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDark ? '#0A0C14' : '#F4F6FC'},
      ]}
      contentContainerStyle={styles.contentContainer}>
      {/* Header Banner */}
      <GlassCard style={styles.headerCard} glow glowColor="rgba(99, 102, 241, 0.25)">
        <Text style={[styles.brandTitle, {color: isDark ? '#E0E7FF' : '#312E81'}]}>
          ✨ MAGD AI ✨
        </Text>
        <Text style={[styles.greetingText, {color: isDark ? '#FFFFFF' : '#1E1B4B'}]}>
          {getGreeting()}
        </Text>
        <Text style={[styles.subText, {color: isDark ? '#94A3B8' : '#475569'}]}>
          {currentL10n.home?.whatBuilding || 'ماذا نعمل اليوم؟'}
        </Text>
      </GlassCard>

      {/* Quick Action Grid */}
      <Text style={[styles.sectionTitle, {color: isDark ? '#E2E8F0' : '#1E293B'}]}>
        {currentL10n.home?.quickActions || 'إجراءات سريعة'}
      </Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigateToChat()}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.chat || 'المحادثة'}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigateToChat({topic: 'code'})}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>👨‍💻</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.code || 'البرمجة'}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigateToChat({topic: 'vision'})}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>👁</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.vision || 'الرؤية'}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigation.navigate(ROUTES.PROJECTS)}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.files || 'الملفات والمشاريع'}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigateToChat({topic: 'electronics'})}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.electronics || 'الإلكترونيات'}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          onPress={() => navigation.navigate(ROUTES.MEMORY)}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionIcon}>🧠</Text>
            <Text style={[styles.actionLabel, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
              {currentL10n.home?.memoryCenter || 'مركز الذاكرة'}
            </Text>
          </GlassCard>
        </TouchableOpacity>
      </View>

      {/* Active Model Status Card */}
      <Text style={[styles.sectionTitle, {color: isDark ? '#E2E8F0' : '#1E293B'}]}>
        {currentL10n.home?.activeModel || 'النموذج النشط'}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MODELS)}>
        <GlassCard style={styles.modelCard}>
          <View style={styles.modelHeader}>
            <View style={styles.modelBadge}>
              <View
                style={[
                  styles.statusDot,
                  {backgroundColor: activeModel ? '#10B981' : '#F59E0B'},
                ]}
              />
              <Text style={styles.modelBadgeText}>
                {activeModel ? 'جاهز (Ready)' : 'غير محمل'}
              </Text>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
          </View>
          <Text style={[styles.modelName, {color: isDark ? '#FFFFFF' : '#0F172A'}]}>
            {activeModel?.name || currentL10n.home?.noModelLoaded || 'اضغط لاختيار أو تحميل نموذج GGUF'}
          </Text>
        </GlassCard>
      </TouchableOpacity>

      {/* Recent Chats */}
      {sessions.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, {color: isDark ? '#E2E8F0' : '#1E293B'}]}>
            {currentL10n.home?.recentChats || 'المحادثات الأخيرة'}
          </Text>
          {sessions.map(session => (
            <TouchableOpacity
              key={session.id}
              onPress={() => {
                chatSessionStore.setActiveSession(session.id);
                navigation.navigate(ROUTES.CHAT);
              }}>
              <GlassCard style={styles.chatSessionCard}>
                <Text
                  numberOfLines={1}
                  style={[styles.chatTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
                  💬 {session.title || 'محادثة جديدة'}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subText: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionGridItem: {
    width: '50%',
    padding: 6,
  },
  actionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  modelCard: {
    padding: 16,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  modelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#6366F1',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '700',
  },
  chatSessionCard: {
    marginBottom: 8,
    paddingVertical: 12,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
});
