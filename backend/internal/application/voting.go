package application

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/yvv4git/voiting/backend/internal/infrastructure"
	"github.com/yvv4git/voiting/backend/internal/interfaces/web"
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

	// Init web router.
	r := gin.Default()
	webHandler := web.NewVotingHandler()
	webHandler.Register(r)

	// Init web server.
	webCfg := a.cfg.VotingApp.WebAPI
	webServer := infrastructure.NewWebServer(a.log, r, fmt.Sprintf("%s:%d", webCfg.Host, webCfg.Port))
	if err := webServer.Run(ctx); err != nil {
		return err
	}

	return nil
}
