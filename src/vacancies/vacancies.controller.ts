import { Controller, Delete, Get, Post, Put, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacaciesDTO } from './dto/create-vacancies.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';


@ApiTags('vacancies')
@Controller('vacancies')
export class VacanciesController {
    constructor(private vacanciesService: VacanciesService) { }

    @Post()
    @ApiOperation({ summary: 'Создать новую вакансию' })
    @ApiResponse({ status: 201, description: 'Вакансия успешно создана' })
    @ApiResponse({ status: 400, description: 'Неверные данные' })
    @ApiBody({ type: CreateVacaciesDTO })
    async createVacancy(@Body() createVacancyDto: CreateVacaciesDTO) {
        return this.vacanciesService.CreateVacancy(createVacancyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все вакансии' })
    @ApiResponse({ status: 200, description: 'Список вакансий' })
    async getVacancies() {
        return this.vacanciesService.getAllVacancies();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить вакансию' })
    @ApiResponse({ status: 200, description: 'Вакансия удалена' })
    @ApiResponse({ status: 404, description: 'Вакансия не найдена' })
    @ApiParam({ name: 'id', type: Number, description: 'ID вакансии' })
    async removeVacancy(@Param('id', ParseIntPipe) id: number) {
        return this.vacanciesService.deleteVacancy(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Обновить вакансию' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Вакансия успешно обновлена'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Вакансия не найдена'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неверные данные для обновления'
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'ID вакансии для обновления'
    })
    @ApiBody({ type: UpdateVacancyDto })
    async updateVacancy(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVacancyDto: UpdateVacancyDto
    ) {
        return await this.vacanciesService.updateVacancy(id, updateVacancyDto);
    }

}
