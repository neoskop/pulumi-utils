import * as struct_pb from 'google-protobuf/google/protobuf/struct_pb';
import { removeUndefined } from '../utils/remove-undefined';

type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

export class Struct {
    static fromJavaScript<T extends { [key: string]: Json }>(value: T) {
        return struct_pb.Struct.fromJavaScript(removeUndefined(value));
    }
}
