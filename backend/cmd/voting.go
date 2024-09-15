/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"log/slog"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/yvv4git/voiting/backend/internal/application"
	"github.com/yvv4git/voiting/backend/internal/infrastructure"
)

// votingCmd represents the api command
var votingCmd = &cobra.Command{
	Use:   "voting",
	Short: "Run voting application",
	Long: `Used for for starting voting application.

	Example usage:
		- go run main.go voting.
		- go run main.go --config config.toml voting.`,

	Run: func(cmd *cobra.Command, args []string) {
		log := infrastructure.NewDefaultLogger()

		var config infrastructure.Config
		err := viper.Unmarshal(&config)
		if err != nil {
			log.Error("unmarshalling config", slog.Any("error", err))
			return
		}

		appAPI := application.NewVotingApp(log, config)
		if err := appAPI.Start(); err != nil {
			log.Error("starting API application", slog.Any("error", err))
		}
	},
}

func init() {
	rootCmd.AddCommand(votingCmd)
}
