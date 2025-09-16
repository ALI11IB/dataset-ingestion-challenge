import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entity representing air quality readings data
 * Maps to the 'readings' table in the database
 */
@Entity('readings')
export class Readings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', comment: 'Date of the reading' })
  date: Date;

  @Column({ type: 'time', comment: 'Time of the reading in HH:MM:SS format' })
  time: string;

  // Air Quality Parameters
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Carbon Monoxide (mg/m³)' })
  co: number;

  @Column({ name: 'pt08_s1_co', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'PT08.S1 (CO) sensor (ppb)' })
  pt08S1Co: number;

  @Column({ name: 'nmhc', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Non-Methanic Hydrocarbons (mg/m³)' })
  nmhc: number;

  @Column({ name: 'c6h6', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Benzene (mg/m³)' })
  c6h6: number;

  @Column({ name: 'pt08_s2_nmhc', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'PT08.S2 (NMHC) sensor (ppb)' })
  pt08S2Nmhc: number;

  @Column({ name: 'nox', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Nitrogen Oxides (ppb)' })
  nox: number;

  @Column({ name: 'pt08_s3_nox', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'PT08.S3 (NOx) sensor (ppb)' })
  pt08S3Nox: number;

  @Column({ name: 'no2', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Nitrogen Dioxide (ppb)' })
  no2: number;

  @Column({ name: 'pt08_s4_no2', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'PT08.S4 (NO2) sensor (ppb)' })
  pt08S4No2: number;

  @Column({ name: 'pt08_s5_o3', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'PT08.S5 (O3) sensor (ppb)' })
  pt08S5O3: number;

  // Environmental Parameters
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Temperature (°C)' })
  temperature: number;

  @Column({ name: 'relative_humidity', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Relative Humidity (%)' })
  relativeHumidity: number;

  @Column({ name: 'absolute_humidity', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: 'Absolute Humidity (g/m³)' })
  absoluteHumidity: number;

  // Audit Fields
  @CreateDateColumn({ comment: 'Record creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ comment: 'Record last update timestamp' })
  updatedAt: Date;
}

