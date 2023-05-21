interface ApiResError{
    message: string,
    error?: any
}

interface ApiResSuccess {
    message?: string,
    data?: any
}

interface ApiPagingResSuccess extends ApiResSuccess {
    page: number,
    pageSize: number
}
