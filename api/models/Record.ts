import mongoose, { Schema, Document, Model, DocumentQuery } from 'mongoose'
import moment from 'moment'
import { IRecord } from '~/types/record'

export interface RecordDoc extends Document, IRecord {}

const recordSchema: Schema = new Schema(
  {
    totalTimeExercising: {
      type: Number,
      min: 0
    },
    totalCaloriesBurned: {
      type: Number,
      min: 0,
      max: 999.99
    },
    totalDistanceRun: {
      type: Number,
      min: 0,
      max: 100
    },
    date: {
      type: Date,
      required: true
    },
    stamps: {
      arms: {
        type: Boolean
      },
      stomach: {
        type: Boolean
      },
      legs: {
        type: Boolean
      },
      yoga: {
        type: Boolean
      }
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const queryHelpers = {
  findByDate(this: DocumentQuery<any, RecordDoc>, date: Date, userId: string) {
    return this.findOne({
      date: {
        $gte: date,
        $lt: moment(date)
          .add(1, 'day')
          .format()
      },
      userId
    })
  },
  findByMonth(this: DocumentQuery<any, RecordDoc>, date: Date, userId: string) {
    return this.find({
      date: {
        $gte: moment(date)
          .startOf('month')
          .format(),
        $lt: moment(date)
          .endOf('month')
          .format()
      },
      userId
    })
  }
}
recordSchema.query = queryHelpers

interface RecordModel extends Model<RecordDoc, typeof queryHelpers> {
  updateById(id: string, record: IRecord): Promise<RecordDoc>
}

const statics = {
  updateById(this: RecordModel, id: string, record: IRecord) {
    return this.findByIdAndUpdate(id, record, {
      new: true,
      runValidators: true
    })
  }
}
recordSchema.statics = statics

export default mongoose.model<RecordDoc, RecordModel>('Record', recordSchema)