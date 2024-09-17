package web

import "github.com/gin-gonic/gin"

type VotingHandler struct {
	// TODO: implement
}

func NewVotingHandler() *VotingHandler {
	return &VotingHandler{}
}

func (v *VotingHandler) Register(router *gin.Engine) {
	votingGroup := router.Group("/api/v1/voting")
	// votingGroup.Use(authMiddleware)
	{
		votingGroup.GET("", v.ListVoting)
		votingGroup.POST("", v.CreateVoting)
		votingGroup.PUT("/:id", v.UpdateVoting)
		votingGroup.DELETE("/:id", v.DeleteVoting)
		votingGroup.POST("/choice/:id", v.MakeChoice)
		votingGroup.GET("/subscribe", v.Subscribe)
	}
}

func (v *VotingHandler) ListVoting(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}

func (v *VotingHandler) CreateVoting(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}

func (v *VotingHandler) UpdateVoting(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}

func (v *VotingHandler) DeleteVoting(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}

func (v *VotingHandler) MakeChoice(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}

func (v *VotingHandler) Subscribe(c *gin.Context) {
	// TODO: implement
	c.JSON(200, gin.H{})
}
