export interface Creator<IEntity> {
  (entry: Partial<IEntity>): IEntity;
}
