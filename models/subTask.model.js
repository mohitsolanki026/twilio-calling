import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
    task_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task', 
        required: true 
    },
    status: { 
        type: Number, 
        enum: [0, 1], 
        default: 0 
    },
    deleted_at: { 
        type: Date, 
        default: null 
    }
  }, { timestamps: true });
  
const Subtask = mongoose.model('Subtask', subtaskSchema);
  
export default Subtask;
