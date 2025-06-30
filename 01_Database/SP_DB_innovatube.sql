USE DB_innovatube;

CREATE PROCEDURE Sp_RegisterUser
    @FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
    @Username NVARCHAR(100),
    @Email NVARCHAR(100),
	@accessPassword NVARCHAR(255)
	
AS
BEGIN
    DECLARE @userId INT

    INSERT INTO Users (FirstName, LastName, UserName, Email, statusUser, accessPassword, FirstLogin)
    VALUES (@FirstName, @LastName, @Username, @Email, 'Activo', @accessPassword, 1)

    SET @userId = SCOPE_IDENTITY()

END;

-- ------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_LoginUser
    @login NVARCHAR(100),
    @accessPassword NVARCHAR(255)
AS
BEGIN
    DECLARE @Id INT;
    DECLARE @StatusUser NVARCHAR(20);
    DECLARE @FirstName NVARCHAR(100);
	DECLARE @LastName NVARCHAR(100);
	DECLARE @Username NVARCHAR(100);
	DECLARE @Email NVARCHAR(100);
    DECLARE @passwordEncrypt NVARCHAR(255);
    DECLARE @firstLogin BIT;

    SELECT @Id = e.Id,
           @StatusUser = e.statusUser,
           @FirstName = e.FirstName,
		   @LastName = e.LastName,
		   @Username = e.Username,
		   @Email = e.Email,
           @passwordEncrypt = e.accessPassword,
           @firstLogin = e.FirstLogin
    FROM Users e
    WHERE (e.Username = @login OR e.Email = @login );

   SELECT @Id AS Id, @FirstName AS FirstName,
        @LastName AS LastName,
        @Username AS Username,
        @Email AS Email,
        @passwordEncrypt AS PasswordHash,
        @StatusUser AS StatusUser,
        @FirstLogin AS FirstLogin;
END;

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_GetAllUsers
AS
BEGIN
    SELECT 
        Id,
        FirstName,
        LastName,
        Username,
        Email,
		accessPassword,
        StatusUser,
        FirstLogin,
        CreatedAt
    FROM Users
    ORDER BY CreatedAt DESC;
END;

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_InsertPasswordResetToken
    @Email NVARCHAR(100),
    @Token NVARCHAR(255),
    @Expiration DATETIME
AS
BEGIN
    INSERT INTO PasswordResetTokens (Email, Token, Expiration)
    VALUES (@Email, @Token, @Expiration)
END

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_InsertVideoIfNotExists
    @IdVideo NVARCHAR(100),
    @Title NVARCHAR(255),
    @ThumbnailUrl NVARCHAR(255),
    @PublishedAt DATETIME
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Videos WHERE IdVideo = @IdVideo)
    BEGIN
        INSERT INTO Videos (IdVideo, Title, ThumbnailUrl, PublishedAt)
        VALUES (@IdVideo, @Title, @ThumbnailUrl, @PublishedAt)
    END
END

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_AddFavoriteVideo
    @UserId INT,
    @VideoId NVARCHAR(100)
AS
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM UserFavoriteVideos WHERE UserId = @UserId AND VideoId = @VideoId
    )
    BEGIN
        INSERT INTO UserFavoriteVideos (UserId, VideoId)
        VALUES (@UserId, @VideoId)
    END
END

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_RemoveFavoriteVideo
    @UserId INT,
    @VideoId NVARCHAR(100)
AS
BEGIN
    DELETE FROM UserFavoriteVideos
    WHERE UserId = @UserId AND VideoId = @VideoId
END

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_GetFavoriteVideosByUser
    @UserId INT
AS
BEGIN
    SELECT 
        v.IdVideo,
        v.Title,
        v.ThumbnailUrl,
        v.PublishedAt,
        ufv.CreatedAt AS FavoritedAt
    FROM UserFavoriteVideos ufv
    INNER JOIN Videos v ON ufv.VideoId = v.IdVideo
    WHERE ufv.UserId = @UserId
    ORDER BY ufv.CreatedAt DESC
END

-- ----------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE Sp_SearchFavoriteVideosByTitle
    @UserId INT,
    @SearchText NVARCHAR(255)
AS
BEGIN
    SELECT 
        v.IdVideo,
        v.Title,
        v.ThumbnailUrl,
        v.PublishedAt
    FROM UserFavoriteVideos ufv
    INNER JOIN Videos v ON ufv.VideoId = v.IdVideo
    WHERE ufv.UserId = @UserId AND v.Title LIKE '%' + @SearchText + '%'
    ORDER BY v.PublishedAt DESC
END

-- ----------------------------------------------------------------------------------------------------------------------------------------