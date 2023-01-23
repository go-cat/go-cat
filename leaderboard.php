<html>

<?php




?>

    <head>
        <meta charset="UTF-8">
        <title>GO CAT</title>
        <link rel="shortcut icon" href="assets/images/go_cat_icon_3b.ico"/>
        <link rel="stylesheet" href="style.css"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="script.js"></script>
    </head>

    <body onload="callfragment()">
        
        <header>
        <div class="center">
            <h3>Leaderboard</h3>
            <img src="./assets/images/cats_hump.png" alt="image of a cat">
            <br>
            <br>
            <a href="index.html"><button>play again!</button></a>
        </div>
        </header>

        <div class="center">
            <br>
            <?php

                if($_SERVER['REQUEST_METHOD'] === 'POST'){

                    include_once "config.php";

                    $val_name = utf8_encode($_POST["name"]);

                    $sql = "INSERT INTO `leaderboard` (`val_name`, `score`) VALUES ('".strval($val_name)."', '".$_POST["score"]."')";
                    mysqli_query($link, $sql);
                    mysqli_close($link);

                    header( "refresh:1;url=leaderboard.php#" . $_POST["name"] );
                }
                else {
                    require_once "config.php";
                    static $count = 0;
                    $sql = "SELECT *, MAX(score) FROM leaderboard GROUP BY val_name ORDER BY MAX(score) DESC";
                    if($result = mysqli_query($link, $sql)){
                        if(mysqli_num_rows($result) > 0){
                            echo '<table>';
                                echo "<thead>";
                                    echo "<tr>";
                                        echo "<th>RANK</th>";
                                        echo "<th>NAME</th>";
                                        echo "<th>SCORE</th>";
                                    echo "</tr>";
                                echo "</thead>";
                                echo "<tbody>";

                                static $color;

                                while($row = mysqli_fetch_array($result)){
                                    $count++;
                                    echo "<tr id='" . $row["val_name"] ."' >";
                                        echo "<td>#" . $count . "</td>";
                                        echo "<td>" . $row['val_name'] . "</td>";
                                        echo "<td>" . $row['MAX(score)'] . "</td>";
                                    echo "</tr>";
                                }
                                echo "</tbody>";                            
                            echo "</table>";
                            mysqli_free_result($result);
                        } else{
                            echo '<div class="alert alert-danger"><em>Oops!</em></div>';
                        }
                    } else{
                        echo "Oops!";
                    }
 
                    // Close connection
                    mysqli_close($link);

                }
    ?>
        </div>
    </body>

</html>