import {z} from 'zod'

export const TrainingModels = z.object({
    name:z.string(),
    type:z.enum(["Man","Women"]),
    age:z.number(),
    ethenicity:z.enum([ 'white','black','asian','southAsian','eastAsian','hispanic']),
    eyeColor:z.enum(['blue','black','white']),
    isBald:z.boolean(),
    images:z.array(z.string()),
    packId: z.string()
})

export const GenerateImage = z.object({
    prompt:z.string(),
    module:z.string(),
    amount:z.number()
})

export const OutputImages = z.object({
    modelId:z.string(),
    packId:z.string()
})