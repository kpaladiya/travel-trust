import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { trustDashboardData } from '../../../src/data/trust-dashboard';
import type {
  IncidentSeverity,
  IncidentStatus,
  TrustProfile,
  TrustRole,
  TrustTier,
  VerificationStatus,
} from '../../../src/types/trust';

const roleLabels: Record<TrustRole, string> = {
  rider: 'Rider',
  traveler: 'Traveler',
  helper: 'Helper',
};

const verificationColors: Record<VerificationStatus, string> = {
  verified: '#1F9D55',
  pending: '#F59E0B',
  rejected: '#E11D48',
  not_started: '#94A3B8',
};

const trustTierColors: Record<TrustTier, string> = {
  trusted: '#1F9D55',
  review: '#F59E0B',
  blocked: '#E11D48',
};

const severityColors: Record<IncidentSeverity, string> = {
  low: '#1D4ED8',
  medium: '#F59E0B',
  high: '#E11D48',
};

const statusColors: Record<IncidentStatus, string> = {
  open: '#E11D48',
  investigating: '#F59E0B',
  resolved: '#1F9D55',
};

function VerificationPill({
  label,
  status,
}: {
  label: string;
  status: VerificationStatus;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: `${verificationColors[status]}18` }]}>
      <Text style={[styles.pillText, { color: verificationColors[status] }]}>
        {label}: {status.replace('_', ' ')}
      </Text>
    </View>
  );
}

function FlaggedProfileCard({ profile }: { profile: TrustProfile }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>{profile.name}</Text>
          <Text style={styles.cardSubtitle}>
            {roleLabels[profile.role]} · {profile.homeCity} · Active {profile.lastActive}
          </Text>
        </View>
        <View
          style={[styles.scoreBadge, { backgroundColor: `${trustTierColors[profile.trustTier]}18` }]}
        >
          <Text style={[styles.scoreBadgeText, { color: trustTierColors[profile.trustTier] }]}>
            {profile.trustTier}
          </Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Trust</Text>
          <Text style={styles.scoreValue}>{profile.trustScore}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Risk</Text>
          <Text style={styles.scoreValue}>{profile.riskScore}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Reports</Text>
          <Text style={styles.scoreValue}>{profile.openReports}</Text>
        </View>
      </View>

      <View style={styles.pillWrap}>
        <VerificationPill label="Email" status={profile.verification.email} />
        <VerificationPill label="Phone" status={profile.verification.phone} />
        <VerificationPill label="ID" status={profile.verification.governmentId} />
        <VerificationPill label="Selfie" status={profile.verification.selfieMatch} />
        <VerificationPill label="Payment" status={profile.verification.paymentMethod} />
      </View>

      <View style={styles.flagsContainer}>
        {profile.flags.map((flag) => (
          <View key={flag} style={styles.flagTag}>
            <Text style={styles.flagTagText}>{flag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function TrustDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Trust Dashboard</Text>
            <Text style={styles.subtitle}>Identity, risk, and operational quality overview</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live trust overview</Text>
          <View style={styles.metricGrid}>
            {trustDashboardData.summaryMetrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text
                  style={[
                    styles.metricChange,
                    metric.trend === 'negative' && styles.metricChangeNegative,
                    metric.trend === 'neutral' && styles.metricChangeNeutral,
                  ]}
                >
                  {metric.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification funnel</Text>
          {trustDashboardData.verificationBreakdown.map((item) => (
            <View key={item.label} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.verified + item.pending + item.rejected} profiles
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownValue, styles.verifiedText]}>
                  Verified {item.verified}
                </Text>
                <Text style={[styles.breakdownValue, styles.pendingText]}>
                  Pending {item.pending}
                </Text>
                <Text style={[styles.breakdownValue, styles.rejectedText]}>
                  Rejected {item.rejected}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trust database schema</Text>
          {trustDashboardData.profileSchemas.map((schema) => (
            <View key={schema.role} style={styles.card}>
              <Text style={styles.cardTitle}>{schema.title}</Text>
              <Text style={styles.cardDescription}>{schema.description}</Text>
              {schema.fields.map((field) => (
                <View key={field.name} style={styles.schemaRow}>
                  <View style={styles.schemaHeader}>
                    <Text style={styles.schemaName}>{field.name}</Text>
                    <Text style={styles.schemaType}>{field.type}</Text>
                  </View>
                  <Text style={styles.schemaPurpose}>
                    {field.required ? 'Required' : 'Optional'} · {field.purpose}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flagged profiles</Text>
          {trustDashboardData.flaggedProfiles.map((profile) => (
            <FlaggedProfileCard key={profile.id} profile={profile} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incident queue</Text>
          {trustDashboardData.incidentQueue.map((incident) => (
            <View key={incident.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardTitle}>{incident.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {roleLabels[incident.role]} · {incident.category}
                  </Text>
                </View>
                <View style={styles.incidentBadges}>
                  <View
                    style={[
                      styles.smallBadge,
                      { backgroundColor: `${severityColors[incident.severity]}18` },
                    ]}
                  >
                    <Text style={[styles.smallBadgeText, { color: severityColors[incident.severity] }]}>
                      {incident.severity}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.smallBadge,
                      { backgroundColor: `${statusColors[incident.status]}18` },
                    ]}
                  >
                    <Text style={[styles.smallBadgeText, { color: statusColors[incident.status] }]}>
                      {incident.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.cardDescription}>{incident.summary}</Text>
              <Text style={styles.timestamp}>Reported {incident.reportedAt}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  backButton: {
    marginRight: 8,
    paddingTop: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
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
  metricChange: {
    marginTop: 8,
    color: '#1F9D55',
    fontSize: 12,
    fontWeight: '600',
  },
  metricChangeNeutral: {
    color: '#2563EB',
  },
  metricChangeNegative: {
    color: '#E11D48',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
    marginTop: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#1F9D55',
  },
  pendingText: {
    color: '#F59E0B',
  },
  rejectedText: {
    color: '#E11D48',
  },
  schemaRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  schemaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  schemaName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  schemaType: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  schemaPurpose: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  scoreBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  scoreRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 12,
  },
  scoreItem: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  flagTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 8,
  },
  flagTagText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  incidentBadges: {
    alignItems: 'flex-end',
  },
  smallBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  smallBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  timestamp: {
    marginTop: 8,
    fontSize: 11,
    color: '#94A3B8',
  },
});
