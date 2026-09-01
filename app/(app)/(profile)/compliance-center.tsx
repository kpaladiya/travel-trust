import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { complianceHighlights, providerDetails } from '../../../src/data/legal';

export default function ComplianceCenterScreen() {
  const router = useRouter();
  const { user, requestAccountDeletion, requestDataExport, setMarketingConsent } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No compliance profile loaded</Text>
        </View>
      </SafeAreaView>
    );
  }

  const compliance = user.compliance ?? {
    termsAcceptedAt: undefined,
    privacyAcceptedAt: undefined,
    communityRulesAcceptedAt: undefined,
    ageConfirmedAt: undefined,
    marketingEmails: false,
    lastUpdatedAt: undefined,
    dataExportRequestedAt: undefined,
    accountDeletionRequestedAt: undefined,
  };

  const handleDataExport = async () => {
    await requestDataExport();
    Alert.alert('Export request recorded', `A support workflow should now send the data export to ${user.email}.`);
  };

  const handleDeletionRequest = async () => {
    await requestAccountDeletion();
    Alert.alert('Deletion request recorded', 'Before launch, connect this action to your verified support and backend deletion workflow.');
  };

  const toggleMarketing = async () => {
    await setMarketingConsent(!compliance.marketingEmails);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Compliance Center</Text>
            <Text style={styles.subtitle}>Privacy, consent, and EU/Germany launch readiness</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your consent summary</Text>
          <View style={styles.card}>
            <ComplianceRow label="Terms accepted" value={formatTimestamp(compliance.termsAcceptedAt)} />
            <ComplianceRow label="Privacy acknowledged" value={formatTimestamp(compliance.privacyAcceptedAt)} />
            <ComplianceRow
              label="Community rules accepted"
              value={formatTimestamp(compliance.communityRulesAcceptedAt)}
            />
            <ComplianceRow label="Age confirmation" value={formatTimestamp(compliance.ageConfirmedAt)} />
            <ComplianceRow
              label="Marketing emails"
              value={compliance.marketingEmails ? 'Enabled' : 'Disabled'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your data rights</Text>
          <View style={styles.card}>
            <ActionButton
              icon="download-outline"
              title="Request data export"
              subtitle={
                compliance.dataExportRequestedAt
                  ? `Requested ${formatTimestamp(compliance.dataExportRequestedAt)}`
                  : 'Record a GDPR-style access/export request.'
              }
              onPress={handleDataExport}
            />
            <ActionButton
              icon="mail-outline"
              title="Toggle marketing consent"
              subtitle="Update optional marketing email consent without affecting the service."
              onPress={toggleMarketing}
            />
            <ActionButton
              icon="trash-outline"
              title="Request account deletion"
              subtitle={
                compliance.accountDeletionRequestedAt
                  ? `Requested ${formatTimestamp(compliance.accountDeletionRequestedAt)}`
                  : 'Record a deletion request for manual/legal workflow handling.'
              }
              onPress={handleDeletionRequest}
              danger
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key compliance highlights</Text>
          {complianceHighlights.map((highlight) => (
            <View key={highlight.title} style={styles.card}>
              <Text style={styles.cardTitle}>{highlight.title}</Text>
              <Text style={styles.cardText}>{highlight.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal documents</Text>
          <View style={styles.card}>
            <LegalLink
              title="Privacy Notice"
              onPress={() => router.push('/legal/privacy-notice')}
            />
            <LegalLink
              title="Terms of Service"
              onPress={() => router.push('/legal/terms-of-service')}
            />
            <LegalLink
              title="Community Rules"
              onPress={() => router.push('/legal/community-rules')}
            />
            <LegalLink
              title="Provider Details"
              onPress={() => router.push('/legal/provider-details')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider contact</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{providerDetails.companyName}</Text>
            <Text style={styles.cardText}>{providerDetails.postalAddress}</Text>
            <Text style={styles.cardText}>Privacy contact: {providerDetails.supportEmail}</Text>
            <Text style={styles.cardText}>Data protection contact: {providerDetails.dpoEmail}</Text>
            <Text style={styles.noteText}>
              Replace these placeholder details with your real company registration, support, and DPO contacts before release.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTimestamp(value?: string) {
  if (!value) {
    return 'Not recorded';
  }

  return new Date(value).toLocaleString();
}

function ComplianceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function LegalLink({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onPress}>
      <Text style={styles.linkTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

function ActionButton({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? '#E11D48' : '#007AFF'} />
      <View style={styles.actionTextContainer}>
        <Text style={[styles.linkTitle, danger && styles.dangerText]}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-start',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
    marginBottom: 6,
  },
  noteText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  actionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dangerText: {
    color: '#E11D48',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
