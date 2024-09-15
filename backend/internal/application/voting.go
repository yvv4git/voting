package application

import (
	"context"
	"log/slog"

	"github.com/yvv4git/voiting/backend/internal/infrastructure"
)

type VotingApp struct {
	application
	cfg infrastructure.Config
}

func NewVotingApp(logger *slog.Logger, cfg infrastructure.Config) *VotingApp {
	a := &VotingApp{
		application: application{
			log: logger,
		},
		cfg: cfg,
	}
	a.app = a

	return a
}

func (a *VotingApp) start(ctx context.Context) error {
	a.log.Info("starting VotingApp application")
	a.log.Info("config",
		slog.Any("voting_service.db", a.cfg.VotingApp.DataBase),
	)
	a.log.Info("config",
		slog.Any("voting_service.web", a.cfg.VotingApp.WebAPI),
	)

	return nil
}
