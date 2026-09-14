import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { GlassCard } from './ui/GlassCard';
import { memoryStore } from '../store/MemoryStore';
import { knowledgeStore } from '../store/KnowledgeStore';
import { projectStore } from '../store/ProjectStore';

export interface SearchResult {
  id: string;
  category: 'Memory' | 'Knowledge' | 'Project';
  title: string;
  snippet: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectResult?: (result: SearchResult) => void;
}

export const UniversalSearchModal: React.FC<Props> = ({ visible, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');

  const getResults = (): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Memories
    memoryStore.memories.forEach((mem) => {
      if (mem.title.toLowerCase().includes(q) || mem.content.toLowerCase().includes(q)) {
        results.push({
          id: mem.id,
          category: 'Memory',
          title: mem.title,
          snippet: mem.content,
        });
      }
    });

    // Search Knowledge Spaces & Documents
    knowledgeStore.spaces.forEach((space) => {
      if (space.title.toLowerCase().includes(q)) {
        results.push({
          id: space.id,
          category: 'Knowledge',
          title: `Knowledge Space: ${space.title}`,
          snippet: `${space.documents.length} documents indexed`,
        });
      }
      space.documents.forEach((doc) => {
        if (doc.name.toLowerCase().includes(q)) {
          results.push({
            id: doc.id,
            category: 'Knowledge',
            title: `Doc: ${doc.name} (${space.title})`,
            snippet: `${doc.chunksCount} chunks indexed`,
          });
        }
      });
    });

    // Search Projects
    projectStore.projects.forEach((proj) => {
      if (proj.name.toLowerCase().includes(q) || proj.description.toLowerCase().includes(q)) {
        results.push({
          id: proj.id,
          category: 'Project',
          title: `Project: ${proj.name}`,
          snippet: proj.description,
        });
      }
    });

    return results;
  };

  const results = getResults();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <GlassCard style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔍 Universal MAGD AI Search</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search across Chats, Memories, Documents, Projects..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              query.trim() !== '' ? (
                <Text style={styles.emptyText}>No matching items found</Text>
              ) : (
                <Text style={styles.emptyText}>Start typing to search everything in MAGD AI</Text>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  onSelectResult?.(item);
                  onClose();
                }}
              >
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultSnippet} numberOfLines={2}>
                    {item.snippet}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00f2fe',
  },
  closeBtn: {
    fontSize: 20,
    color: '#fff',
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  emptyText: {
    color: '#8e8e93',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 13,
  },
  resultItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  categoryText: {
    color: '#00f2fe',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultSnippet: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
});
