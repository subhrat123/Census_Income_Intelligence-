# Databricks notebook source
import mlflow
mlflow.end_run()

import os

os.environ["MLFLOW_DFS_TMP"] = "/Volumes/workspace/default/mlflow_volume/tmp"

from pyspark.ml.classification import *
from pyspark.ml.evaluation import *
from pyspark.ml.feature import VectorAssembler

from pyspark.sql.functions import *

from mlflow.models.signature import infer_signature


# Read dataset

df = spark.read.table("workspace.default.census_cleaned")


# Create label

df = df.withColumn(
    "label",
    when(col("income") == ">80K", 1).otherwise(0)
)


# Fill null values

df = df.fillna({
    "age": 0,
    "education-num": 0,
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 0
})


# Assemble features

assembler = VectorAssembler(

    inputCols=[
        "age",
        "education-num",
        "capital-gain",
        "capital-loss",
        "hours-per-week"
    ],

    outputCol="features"
)


final_df = assembler.transform(df)

final_df = final_df.select(
    "features",
    "label"
)


# Split dataset

train_df, test_df = final_df.randomSplit(
    [0.8, 0.2],
    seed=42
)


# Logistic Regression Run

with mlflow.start_run():

    lr = LogisticRegression(
        featuresCol="features",
        labelCol="label"
    )

    lr_model = lr.fit(train_df)

    predictions = lr_model.transform(test_df)

    evaluator = MulticlassClassificationEvaluator(

        labelCol="label",

        predictionCol="prediction",

        metricName="accuracy"
    )

    accuracy = evaluator.evaluate(predictions)


    mlflow.log_param(
        "model_type",
        "LogisticRegression"
    )


    mlflow.log_metric(
        "accuracy",
        accuracy
    )


    print("Logistic Regression Accuracy:", accuracy)


# Ensure previous run closed

mlflow.end_run()


# Decision Tree Run

with mlflow.start_run():

    dt = DecisionTreeClassifier(

        featuresCol="features",

        labelCol="label"
    )

    dt_model = dt.fit(train_df)

    dt_predictions = dt_model.transform(test_df)

    evaluator = MulticlassClassificationEvaluator(

        labelCol="label",

        predictionCol="prediction",

        metricName="accuracy"
    )

    dt_accuracy = evaluator.evaluate(dt_predictions)


    mlflow.log_param(
        "model_type",
        "DecisionTree"
    )


    mlflow.log_metric(
        "accuracy",
        dt_accuracy
    )


    # Infer model signature

    sample_input = test_df.limit(5)

    sample_output = dt_model.transform(sample_input)

    signature = infer_signature(
        sample_input.toPandas(),
        sample_output.toPandas()
    )


    # Log model

    mlflow.spark.log_model(

        spark_model=dt_model,

        artifact_path="decision_tree_model",

        signature=signature
    )


    # Register model

    run_id = mlflow.active_run().info.run_id

    model_uri = f"runs:/{run_id}/decision_tree_model"


    registered_model = mlflow.register_model(
        model_uri,
        "CensusIncomeDecisionTreeModel"
    )


    print("Decision Tree Accuracy:", dt_accuracy)

    print(registered_model)