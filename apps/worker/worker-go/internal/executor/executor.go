package executor

type Executor interface {
	Run(code string, language string) (string, string, int64, error)
}
