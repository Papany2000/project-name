// src/projects/interfaces/project-response.interface.ts

/**
 * Интерфейс ответа с данными проекта
 */
export interface ProjectResponse {
    id: number;
    obj_name: string;
    foto: string | null;
    comments: string | null;
    original_filename: string | null;
    mimetype: string | null;
    size: number | null;
    created_at: Date;
    updated_at: Date;
}

/**
 * Интерфейс ответа с URL файла проекта
 */
export interface ProjectWithUrlResponse extends ProjectResponse {
    foto_url: string | null;
    foto_public_url: string | null;
}

/**
 * Интерфейс для загрузки файла
 */
export interface FileUploadResponse {
    filename: string;
    presigned_url: string;
    public_url: string;
    mimetype: string;
    size: number;
}

/**
 * Интерфейс для создания проекта
 */
export interface CreateProjectRequest {
    obj_name: string;
    comments?: string;
}

/**
 * Интерфейс для обновления проекта
 */
export interface UpdateProjectRequest {
    obj_name?: string;
    comments?: string;
}

/**
 * Интерфейс для ошибок MinIO
 */
export interface MinioError {
    code: string;
    message: string;
    resource?: string;
    requestId?: string;
}

/**
 * Интерфейс для статистики файла
 */
export interface FileStats {
    filename: string;
    size: number;
    lastModified: Date;
    contentType: string;
    etag: string;
}

/**
 * Интерфейс для пагинации проектов
 */
export interface PaginatedProjectsResponse {
    data: ProjectWithUrlResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Интерфейс для фильтрации проектов
 */
export interface ProjectFilter {
    obj_name?: string;
    created_after?: Date;
    created_before?: Date;
    has_photo?: boolean;
}

/**
 * Интерфейс для сортировки проектов
 */
export interface ProjectSort {
    field: 'id' | 'obj_name' | 'created_at' | 'updated_at';
    order: 'ASC' | 'DESC';
}

/**
 * Интерфейс для опций запроса проектов
 */
export interface ProjectsQueryOptions {
    filter?: ProjectFilter;
    sort?: ProjectSort;
    page?: number;
    limit?: number;
}

/**
 * Интерфейс для ответа при удалении файла
 */
export interface DeleteFileResponse {
    message: string;
    filename: string;
    deleted_at: Date;
}

/**
 * Интерфейс для ответа при удалении проекта
 */
export interface DeleteProjectResponse {
    message: string;
    id: number;
    deleted_at: Date;
    files_deleted: number;
}

/**
 * Интерфейс для валидации файла
 */
export interface FileValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    fileInfo?: {
        originalname: string;
        mimetype: string;
        size: number;
        extension: string;
    };
}

/**
 * Интерфейс для статистики проекта
 */
export interface ProjectStats {
    total_projects: number;
    projects_with_photos: number;
    projects_without_photos: number;
    total_photos_size: number;
    avg_photo_size: number;
    last_updated: Date;
}

/**
 * Интерфейс для экспорта проекта
 */
export interface ProjectExport {
    project: ProjectWithUrlResponse;
    metadata: {
        exported_at: Date;
        export_format: 'json' | 'csv';
        version: string;
    };
}

/**
 * Интерфейс для массовой операции с проектами
 */
export interface BulkOperationResponse {
    total: number;
    success: number;
    failed: number;
    errors: Array<{
        id: number;
        error: string;
    }>;
    operation: 'delete' | 'update' | 'export';
}

/**
 * Интерфейс для DTO создания проекта с файлом
 */
export interface CreateProjectWithFileDto extends CreateProjectRequest {
    file?: Express.Multer.File;
}

/**
 * Интерфейс для ответа при тестировании подключения к MinIO
 */
export interface MinioHealthCheck {
    status: 'healthy' | 'unhealthy';
    bucket: string;
    endpoint: string;
    port: number;
    timestamp: Date;
    error?: string;
}

/**
 * Интерфейс для кэширования URL
 */
export interface CachedUrl {
    url: string;
    expires_at: Date;
    generated_at: Date;
    is_presigned: boolean;
}