export interface DictionaryRep {
  id: number;
  dictionary: string;
  code: string;
  shortValue: string;
  value: string;
  description: string;
  icon: string;
  data: string;
  dataJSON?: any;
  updatedAt: Date;
  updatedBy: number;
  createdAt: Date;
  createdBy: number;
}
