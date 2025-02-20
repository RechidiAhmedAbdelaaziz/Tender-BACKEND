import { IsBoolean, IsString, IsUrl } from "class-validator";

export class CreateAnnouncerBody {
    /**
     * Name of the announcer
     * @example John Doe
     */
    @IsString()
    name: string;

    /**
     * Image URL of the announcer
     * @example https://example.com/image.jpg
     */
    @IsUrl()
    imageUri: string;

    /**
     * Is the announcer a startup?
     * @example true
     */
    @IsBoolean()
    isStartup: boolean;
    

}