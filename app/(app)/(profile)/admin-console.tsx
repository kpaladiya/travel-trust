import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { adminConsoleData } from '../../../src/data/admin-console';
import type { AdminAlert, AdminKpi, DataRightsRequest, LegalVersionEntry, VerificationReview } from '../../../src/types/admin';
import { useAuth } from '../../../src/context/AuthContext';
import { canAccessAdminConsole } from '../../../src/services/admin-access';

const trendColors: Record<AdminKpi['trend'], string> = {
  up: '#1F9D55',
  down: '#E11D48',
  stable: '#2563EB',
};

const priorityColors: Record<DataRightsRequest['priority'], string> = {
  low: '#2563EB',
  medium: '#F59E0B',
  high: '#E11D48',
};

const statusColors: Record<DataRightsRequest['status'], string> = {
  pending: '#F59E0B',
  approved: '#1F9D55',
  blocked: '#E11D48',
  in_review: '#2563EB',
};

const legalStatusColors: Record<LegalVersionEntry['status'], string> = {
  draft: '#F59E0B',
  published: '#1F9D55',
  archived: '#64748B',
};

export default function AdminConsoleScreen() {
  const router = useRouter();
  const { user } = useAuth();

  if (!canAccessAdminConsole(user?.email)) {
    return <Redirect href="/(app)/(profile)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Admin Console</Text>
            <Text style={styles.subtitle}>CEO and operator view for legal, trust, and review workflows</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive snapshot</Text>
          <View style={styles.metricGrid}>
            {adminConsoleData.kpis.map((kpi) => (
              <TouchableOpacity
                key={kpi.id}
                style={styles.metricCard}
                onPress={() => Alert.alert(kpi.label, kpi.context)}
              >
                <Text style={styles.metricLabel}>{kpi.label}</Text>
                <Text style={styles.metricValue}>{kpi.value}</Text>
                <Text style={[styles.metricContext, { color: trendColors[kpi.trend] }]}>{kpi.context}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immediate launch blockers</Text>
          {adminConsoleData.alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data rights request queue</Text>
          {adminConsoleData.rightsRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification review queue</Text>
          {adminConsoleData.verificationQueue.map((review) => (
            <VerificationCard key={review.id} review={review} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal document version history</Text>
          {adminConsoleData.legalVersions.map((entry) => (
            <LegalVersionCard key={entry.id} entry={entry} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AlertCard({ alert }: { alert: AdminAlert }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{alert.title}</Text>
        <PriorityBadge priority={alert.severity} />
      </View>
      <Text style={styles.cardText}>{alert.description}</Text>
    </View>
  );
}

function RequestCard({ request }: { request: DataRightsRequest }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{request.userName}</Text>
          <Text style={styles.cardSubtitle}>
            {request.requestType} request · {request.jurisdiction}
          </Text>
        </View>
        <StatusBadge status={request.status} />
      </View>
      <Text style={styles.cardText}>Requested {request.requestedAt}</Text>
      <View style={styles.inlineRow}>
        <PriorityBadge priority={request.priority} />
        <TouchableOpacity
          style={styles.inlineAction}
          onPress={() => Alert.alert('Ops note', 'Connect this queue to your backend case management before launch.')}
        >
          <Text style={styles.inlineActionText}>View handling note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VerificationCard({ review }: { review: VerificationReview }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{review.userName}</Text>
          <Text style={styles.cardSubtitle}>
            {review.role} · assigned to {review.assignedTo}
          </Text>
        </View>
        <StatusBadge status={review.status} />
      </View>
      <Text style={styles.cardText}>{review.issue}</Text>
      <View style={styles.inlineRow}>
        <PriorityBadge priority={review.priority} />
        <TouchableOpacity
          style={styles.inlineAction}
          onPress={() => Alert.alert('Manual review', `This item should be reviewed by ${review.assignedTo}.`)}
        >
          <Text style={styles.inlineActionText}>Open review note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LegalVersionCard({ entry }: { entry: LegalVersionEntry }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{entry.documentName}</Text>
          <Text style={styles.cardSubtitle}>{entry.version}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${legalStatusColors[entry.status]}18` }]}>
          <Text style={[styles.badgeText, { color: legalStatusColors[entry.status] }]}>{entry.status}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>Effective date: {entry.effectiveDate}</Text>
      <Text style={styles.cardText}>Owner: {entry.owner}</Text>
    </View>
  );
}

function PriorityBadge({ priority }: { priority: DataRightsRequest['priority'] }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${priorityColors[priority]}18` }]}>
      <Text style={[styles.badgeText, { color: priorityColors[priority] }]}>{priority}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: DataRightsRequest['status'] }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${statusColors[status]}18` }]}>
      <Text style={[styles.badgeText, { color: statusColors[status] }]}>{status.replace('_', ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 10,
    paddingTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: '47%',
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  metricContext: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  cardText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  inlineAction: {
    marginLeft: 10,
    paddingVertical: 6,
  },
  inlineActionText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
