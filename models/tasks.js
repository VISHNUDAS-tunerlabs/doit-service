/**
 * name             : tasks.js.
 * author           : vishnu.
 * created-date     : 31-Oct-2024.
 * Description      : Schema for tasks.
 */

module.exports = {
  name: 'tasks',
  schema: {
    title: {
      type: String,
      index: true,
    },
    description: {
      type: String,
      index: true,
    },
    metaInformation: {
      type: Object,
      default: {},
    },
    assignedTo: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      default: 'assigned',
      index: true,
    },
    assigneeName: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    updatedBy: {
      type: String,
      default: 'SYSTEM',
    },
    startedAt: Date,
    completedAt: Date,
    createdBy: {
      type: String,
      default: 'SYSTEM',
      index: true,
    },
    statusUpdateHistory: {
      type: Array,
    },
    priority: {
      type: String,
      index: true,
    },
  },
};
