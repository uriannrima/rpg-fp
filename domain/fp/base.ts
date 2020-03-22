export interface Creator<TEntity> {
  (entity?: Partial<TEntity>): TEntity;
}
