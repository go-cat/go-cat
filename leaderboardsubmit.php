<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GO CAT</title>
    <link rel="shortcut icon" href="assets/images/go_cat_icon_3b.ico"/>
    <link rel="stylesheet" href="style.css"/>
</head>
<body>
<div id="container" style="width: 800px; margin: 0 auto">

    <div id="leaderform" style="display: block;">

        <img src="./assets/images/cat_sitting.png" alt="image of an sitting cat">
        <br>

        <?php 
        echo "Your score: " . strval($_POST["score"]);
        ?>
        <br>
        <br>
        <form method="post" action="leaderboard.php">
            <label for="nameform">name:</label> 
            <br>
            <input type="text" name="name" id="nameform">
            <?php 
            echo "<input style='display: none;' type='number' name='score' value='" . $_POST["score"] . "'>"
            ?>
            <br>
            <br>
            <input type="submit" value="send" id="submitform">
        </form>
    </div>

</div>
</body>
</html>
