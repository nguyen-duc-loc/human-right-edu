export interface IStorage {
  getAll: (bucketName: string) => Promise<{
    bucketName: string;
    numberOfObjects: number;
    objects: StorageObject[];
  }>;
  getUrlByKey(bucketName: string, key: string | null): Promise<string | null>;
  putByKey(bucketName: string, key: string, file: File): Promise<void>;
  deleteByKey(bucketName: string, key: string): Promise<void>;
}
