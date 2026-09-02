import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DateTimeMode = 'date' | 'time';

type DateTimeInputProps = {
  mode: DateTimeMode;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
};

export const formatDateInput = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

const formatTimeInput = (value: Date) =>
  `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;

const pickerValue = (mode: DateTimeMode, value: string, minDate?: string) => {
  if (mode === 'date') {
    const parsedDate = value ? new Date(`${value}T12:00:00`) : minDate ? new Date(`${minDate}T12:00:00`) : new Date();
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();

  if (Number.isInteger(hours) && Number.isInteger(minutes)) {
    date.setHours(hours, minutes, 0, 0);
  }

  return date;
};

export function DateTimeInput({ mode, value, onChange, minDate }: DateTimeInputProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isDate = mode === 'date';
  const placeholder = isDate ? 'Select date' : 'Select time';

  if (Platform.OS === 'web') {
    return (
      <input
        aria-label={isDate ? 'Select date' : 'Select time'}
        className="date-time-input"
        min={isDate ? minDate : undefined}
        onChange={(event) => onChange(event.target.value)}
        type={mode}
        value={value}
      />
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.trigger}>
        <Ionicons name={isDate ? 'calendar-outline' : 'time-outline'} size={20} color="#007AFF" />
        <Text style={[styles.triggerText, !value && styles.placeholder]}>{value || placeholder}</Text>
      </TouchableOpacity>
      {isPickerVisible ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={isDate && minDate ? new Date(`${minDate}T00:00:00`) : undefined}
          mode={mode}
          onChange={(_event, selectedValue) => {
            setIsPickerVisible(false);
            if (selectedValue) {
              onChange(isDate ? formatDateInput(selectedValue) : formatTimeInput(selectedValue));
            }
          }}
          value={pickerValue(mode, value, minDate)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  triggerText: {
    marginLeft: 8,
    color: '#111827',
    fontSize: 14,
  },
  placeholder: {
    color: '#6B7280',
  },
});
