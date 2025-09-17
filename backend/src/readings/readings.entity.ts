import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('readings')
@Index(['date', 'time'])
@Index(['date'])
@Index(['co'])
@Index(['c6h6'])
@Index(['nox'])
@Index(['no2'])
export class Readings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  co: number;

  @Column({ name: 'pt08_s1_co', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pt08S1Co: number;

  @Column({ name: 'nmhc', type: 'decimal', precision: 10, scale: 2, nullable: true })
  nmhc: number;

  @Column({ name: 'c6h6', type: 'decimal', precision: 10, scale: 2, nullable: true })
  c6h6: number;

  @Column({ name: 'pt08_s2_nmhc', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pt08S2Nmhc: number;

  @Column({ name: 'nox', type: 'decimal', precision: 10, scale: 2, nullable: true })
  nox: number;

  @Column({ name: 'pt08_s3_nox', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pt08S3Nox: number;

  @Column({ name: 'no2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  no2: number;

  @Column({ name: 'pt08_s4_no2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pt08S4No2: number;

  @Column({ name: 'pt08_s5_o3', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pt08S5O3: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  temperature: number;

  @Column({ name: 'relative_humidity', type: 'decimal', precision: 10, scale: 2, nullable: true })
  relativeHumidity: number;

  @Column({ name: 'absolute_humidity', type: 'decimal', precision: 10, scale: 2, nullable: true })
  absoluteHumidity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

