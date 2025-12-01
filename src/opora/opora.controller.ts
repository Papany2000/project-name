import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    ParseIntPipe,
    HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiConsumes,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { OporaService } from './opora.service';
import { CreateOporaDto } from './dto/create-opora.dto';
import { UpdateOporaDto } from './dto/update-opora.dto';
import { Opora } from './opora.model';


@ApiTags('opora') // Группировка в Swagger UI
@Controller('opora')
export class OporaController {
    constructor(private readonly oporaService: OporaService) { }

    @Post()
    @ApiOperation({
        summary: 'Создать новую опору',
        description: 'Создает новую запись опоры ЛЭП в системе'
    })
    @ApiCreatedResponse({
        description: 'Опora успешно создана',
        type: Opora
    })
    @ApiBadRequestResponse({
        description: 'Неверные данные запроса или опора с таким ID уже существует'
    })
    @ApiBody({ type: CreateOporaDto })
    create(@Body() createOporaDto: CreateOporaDto) {
        return this.oporaService.create(createOporaDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Получить все опоры',
        description: 'Возвращает список всех опор ЛЭП с их фотографиями'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Список опор успешно получен',
        type: [Opora]
    })
    findAll() {
        return this.oporaService.findAll();
    }

    @Get('status/:status')
    @ApiOperation({
        summary: 'Получить опоры по статусу',
        description: 'Возвращает опоры ЛЭП отфильтрованные по статусу'
    })
    @ApiParam({
        name: 'status',
        enum: ['соответствует', 'не соответствует', 'в работе'],
        description: 'Статус опоры для фильтрации'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Список опор по статусу успешно получен',
        type: [Opora]
    })
    @ApiBadRequestResponse({ description: 'Неверный статус' })
    findByStatus(@Param('status') status: string) {
        return this.oporaService.findByStatus(status);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получить опору по ID',
        description: 'Возвращает опору ЛЭП по её внутреннему идентификатору'
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Внутренний ID опоры в системе'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Опora успешно найдена',
        type: Opora
    })
    @ApiNotFoundResponse({ description: 'Опora с указанным ID не найдена' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.oporaService.findOne(id);
    }

    @Get('by-opora-id/:oporaId')
    @ApiOperation({
        summary: 'Получить опору по внешнему ID',
        description: 'Возвращает опору ЛЭП по её внешнему идентификатору (oporaId)'
    })
    @ApiParam({
        name: 'oporaId',
        type: String,
        description: 'Внешний ID опоры (например: OPORA-001)'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Опora успешно найдена',
        type: Opora
    })
    @ApiNotFoundResponse({ description: 'Опora с указанным oporaId не найдена' })
    findByOporaId(@Param('oporaId') oporaId: string) {
        return this.oporaService.findByOporaId(oporaId);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Обновить опору',
        description: 'Обновляет информацию об опоре ЛЭП'
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Внутренний ID опоры для обновления'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Опora успешно обновлена',
        type: Opora
    })
    @ApiNotFoundResponse({ description: 'Опora с указанным ID не найдена' })
    @ApiBadRequestResponse({ description: 'Неверные данные для обновления' })
    @ApiBody({ type: UpdateOporaDto })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOporaDto: UpdateOporaDto,
    ) {
        return this.oporaService.update(id, updateOporaDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удалить опору',
        description: 'Удаляет опору ЛЭП и все связанные с ней фотографии'
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Внутренний ID опоры для удаления'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Опora успешно удалена'
    })
    @ApiNotFoundResponse({ description: 'Опora с указанным ID не найдена' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.oporaService.remove(id);
    }

    @Post(':oporaId/photos')
    @UseInterceptors(FilesInterceptor('photos', 10))
    @ApiOperation({
        summary: 'Загрузить фотографии для опоры',
        description: 'Загружает фотографии опоры ЛЭП в MinIO и привязывает их к записи'
    })
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'oporaId',
        type: String,
        description: 'Внешний ID опоры (например: OPORA-001)'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Фотографии успешно загружены',
        type: Opora
    })
    @ApiNotFoundResponse({ description: 'Опora с указанным oporaId не найдена' })
    @ApiBadRequestResponse({ description: 'Файлы не были предоставлены или произошла ошибка загрузки' })
    @ApiBody({
        description: 'Фотографии опоры',
        schema: {
            type: 'object',
            properties: {
                photos: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Максимум 10 файлов, каждый до 10MB. Поддерживаемые форматы: JPEG, PNG, GIF',
                },
            },
        },
    })
    async uploadPhotos(
        @Param('oporaId') oporaId: string,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Не выбраны файлы для загрузки');
        }

        return this.oporaService.addPhotos(oporaId, files);
    }

    @Delete(':oporaId/photos/:photoFilename')
    @ApiOperation({
        summary: 'Удалить фотографию опоры',
        description: 'Удаляет фотографию опоры из MinIO и базы данных'
    })
    @ApiParam({
        name: 'oporaId',
        type: String,
        description: 'Внешний ID опоры'
    })
    @ApiParam({
        name: 'photoFilename',
        type: String,
        description: 'Имя файла фотографии для удаления'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Фотография успешно удалена',
        type: Opora
    })
    @ApiNotFoundResponse({ description: 'Опora или фотография не найдены' })
    async removePhoto(
        @Param('oporaId') oporaId: string,
        @Param('photoFilename') photoFilename: string,
    ) {
        return this.oporaService.removePhoto(oporaId, photoFilename);
    }
}