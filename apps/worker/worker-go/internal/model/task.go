package model

type TaskStatus string

const (
	NotStarted TaskStatus = "NOT_STARTED"
	Pending    TaskStatus = "PENDING"
	Running    TaskStatus = "RUNNING"
	Finished   TaskStatus = "FINISHED"
	Failed     TaskStatus = "FAILED"
	Cancelled  TaskStatus = "CANCELLED"
)

type TaskSubmittedEvent struct {
	Id       string `json:"id"`
	Code     string `json:"code"`
	Language string `json:"language"`
}

type TaskResponseEvent struct {
	Id       string     `json:"id"`
	Status   TaskStatus `json:"status"`
	Output   string     `json:"output"`
	Error    string     `json:"error"`
	Duration *int64     `json:"duration"`
}
