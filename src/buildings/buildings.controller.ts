import { Controller, Get, Post } from '@nestjs/common';

@Controller('buildings')
export class BuildingsController {

    @Get()
    getApiState() : string{
        return "api disponible."
    }

    @Post()
    createResource(){
        return "ressource crée."
    }
}
