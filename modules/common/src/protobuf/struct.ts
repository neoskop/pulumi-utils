import * as struct_pb from 'google-protobuf/google/protobuf/struct_pb';
import { removeUndefined } from '../utils/remove-undefined';

export class Struct extends struct_pb.Struct {
    static fromJavaScript(value: { [key: string]: struct_pb.JavaScriptValue }) {
        return struct_pb.Struct.fromJavaScript(removeUndefined(value));
    }

    private constructor() {
        super();
    }
}
