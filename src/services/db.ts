import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DocumentFieldKey, FieldConfig, SavedRecord, TemplateData, DEFAULT_FIELD_CONFIGS, FIELD_CONFIG_VERSION } from '../types';

interface SmartDocDBSchema extends DBSchema {
  templates: {
    key: string;
    value: TemplateData;
  };
  field_configs: {
    key: string;
    value: Record<DocumentFieldKey, FieldConfig>;
  };
  records: {
    key: string;
    value: SavedRecord;
    indexes: { 'by-date': number };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'smartdoc_studio_db';
const DB_VERSION = 1;
const TEMPLATE_KEY = 'primary_template';
const FIELDS_KEY = 'active_field_configs';

let dbPromise: Promise<IDBPDatabase<SmartDocDBSchema>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SmartDocDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('field_configs')) {
          db.createObjectStore('field_configs');
        }
        if (!db.objectStoreNames.contains('records')) {
          const recordStore = db.createObjectStore('records', { keyPath: 'id' });
          recordStore.createIndex('by-date', 'createdAt');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// === Template Storage ===
export async function savePrimaryTemplate(template: TemplateData): Promise<void> {
  const db = await getDB();
  // Strip originalPdfBuffer to prevent "ArrayBuffer is detached and could not be cloned" error in IndexedDB
  const { originalPdfBuffer, ...cleanTemplate } = template;
  await db.put('templates', {
    ...cleanTemplate,
    id: TEMPLATE_KEY,
    updatedAt: Date.now(),
  });
}

export async function getPrimaryTemplate(): Promise<TemplateData | null> {
  const db = await getDB();
  const template = await db.get('templates', TEMPLATE_KEY);
  return template || null;
}

export async function deletePrimaryTemplate(): Promise<void> {
  const db = await getDB();
  await db.delete('templates', TEMPLATE_KEY);
}

// === Field Configurations Storage ===
export async function saveFieldConfigs(configs: Record<DocumentFieldKey, FieldConfig>): Promise<void> {
  const db = await getDB();
  await db.put('field_configs', { ...configs, _version: FIELD_CONFIG_VERSION } as any, FIELDS_KEY);
}

export async function getFieldConfigs(): Promise<Record<DocumentFieldKey, FieldConfig>> {
  const db = await getDB();
  const configs = (await db.get('field_configs', FIELDS_KEY)) as any;
  
  // Verify configuration matches current pixel-accurate version
  const isUpToDate =
    configs &&
    configs._version === FIELD_CONFIG_VERSION &&
    configs.branchName &&
    configs.branchName.x === 255 &&
    configs.branchName.y === 175;

  if (!isUpToDate) {
    const updated = { ...DEFAULT_FIELD_CONFIGS, _version: FIELD_CONFIG_VERSION } as any;
    await db.put('field_configs', updated, FIELDS_KEY);
    return DEFAULT_FIELD_CONFIGS;
  }

  return {
    ...DEFAULT_FIELD_CONFIGS,
    ...configs,
  };
}

// === Customer Records Storage ===
export async function saveCustomerRecord(record: SavedRecord): Promise<void> {
  const db = await getDB();
  await db.put('records', record);
}

export async function getAllCustomerRecords(): Promise<SavedRecord[]> {
  const db = await getDB();
  const records = await db.getAllFromIndex('records', 'by-date');
  return records.reverse(); // latest first
}

export async function deleteCustomerRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('records', id);
}

// === Full Workspace Backup / Restore ===
export async function exportWorkspaceBackup(): Promise<string> {
  const template = await getPrimaryTemplate();
  const fields = await getFieldConfigs();
  const records = await getAllCustomerRecords();

  const backupData = {
    appName: 'SmartDoc Studio',
    version: '1.0',
    exportDate: new Date().toISOString(),
    template,
    fields,
    records,
  };

  return JSON.stringify(backupData);
}

export async function importWorkspaceBackup(jsonContent: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonContent);
    if (data.template) {
      await savePrimaryTemplate(data.template);
    }
    if (data.fields) {
      await saveFieldConfigs(data.fields);
    }
    if (Array.isArray(data.records)) {
      for (const rec of data.records) {
        if (rec && rec.id) {
          await saveCustomerRecord(rec);
        }
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to import backup JSON', err);
    return false;
  }
}
