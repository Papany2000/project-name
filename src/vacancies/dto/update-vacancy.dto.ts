import { PartialType } from '@nestjs/mapped-types';
import { CreateVacaciesDTO } from './create-vacancies.dto';


export class UpdateVacancyDto extends PartialType(CreateVacaciesDTO) { }