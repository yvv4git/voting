package infrastructure

type (
	Config struct {
		VotingApp VotingApplication `mapstructure:"voting_service"`
	}

	VotingApplication struct {
		DataBase DB     `mapstructure:"db"`
		WebAPI   WebAPI `mapstructure:"web"`
	}

	DB struct {
		DBName   string `mapstructure:"dbname"`
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		Username string `mapstructure:"username"`
		Password string `mapstructure:"password"`
	}

	WebAPI struct {
		Host         string `mapstructure:"host"`
		Port         int    `mapstructure:"port"`
		ReadTimeout  int    `mapstructure:"read_timeout"`
		WriteTimeout int    `mapstructure:"write_timeout"`
		IdleTimeout  int    `mapstructure:"idle_timeout"`
	}
)
