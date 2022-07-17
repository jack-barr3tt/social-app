import { OnDeleteType } from "typeorm/metadata/types/OnDeleteType";

export const CASCADE = { onDelete: 'CASCADE' } as { onDelete: OnDeleteType }
