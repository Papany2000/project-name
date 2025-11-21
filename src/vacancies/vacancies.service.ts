import { InjectModel } from "@nestjs/sequelize"
import { Vacancies } from "./vacancies.model"
import { CreateVacaciesDTO } from "./dto/create-vacancies.dto"
import { UpdateVacancyDto } from "./dto/update-vacancy.dto"
import { NotFoundException } from "@nestjs/common"

export class VacanciesService {
    constructor(@InjectModel(Vacancies) private vacanciesRepository: typeof Vacancies) { }   // @InjectModel(User) передает данные UsersService  из класса User

    // методы для работы с сущностью 

    // создание вакансии
    async CreateVacancy(dto: CreateVacaciesDTO) {
        const vacancies = await this.vacanciesRepository.create({ ...dto })
        return vacancies
    }
    // получение всех вакансий
    async getAllVacancies() {
        const users = await this.vacanciesRepository.findAll()
        return users
    }
    // удаление вакансии
    async deleteVacancy(id: any) {
        const users = await this.vacanciesRepository.destroy({
            where: {
               id
            }
        })
        return users
    }

    // обновление вакансии
    async updateVacancy(id: number, updateVacancyDto: UpdateVacancyDto) {
        const existingVacancy = await this.vacanciesRepository.findOne({
            where: { id }
        });

        if (!existingVacancy) {
            throw new NotFoundException(`Вакансия с ID ${id} не найдена`);
        }

        // Обновляем вакансию
        await this.vacanciesRepository.update(updateVacancyDto, {
            where: { id }
        });

        // Получаем обновленную вакансию
        const updatedVacancy = await this.vacanciesRepository.findOne({
            where: { id }
        });

        return updatedVacancy;
    }
   
}
