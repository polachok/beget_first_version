<?php
  require_once 'security.php';
  session_name("BegetCp");
  session_start();
  if (notAuthorized()){
      header("Location: $base_url");
      exit;
  }
  $date = new Crontab_($_POST);
  $date->getdate();
?>