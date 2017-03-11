import Q = require("q");

import TFS_Git_Client = require("TFS/VersionControl/GitRestClient");
import VCContracts = require("TFS/VersionControl/Contracts");
import VSS_Service = require("VSS/Service");
import Utils_String = require("VSS/Utils/String");
import TFS_Core_Contracts = require("TFS/Core/Contracts");

export interface IGitData {
    name: string;
    service: string;
    milestone: string;
    content: string;
    repoName?: string;
}
export class DataService {
    private _gitClient;
    private _webContext;
    constructor() {
        this._gitClient = TFS_Git_Client.getClient();
        this._webContext = this._getWebContext();
    }

    public getRepositories() {
        
    }

    public createPR(data: IGitData): IPromise<VCContracts.GitPullRequest> {
        const sourceRefName = "refs/heads/master";
        const repositoryName = data.repoName || "VSO.ConfigChange"
        return this._createBranch(data, repositoryName).then(push => {
               return this._gitClient.createPullRequest({
                    "sourceRefName": `refs/heads/${data.name}`,
                    "targetRefName": "refs/heads/master",
                    "title": data.name,
                    "description": "",
                    "reviewers": []
                    }, repositoryName, this._webContext.project.id, true, true);
            });
    }

    private _createBranch(data: IGitData, repositoryName: string) {
        return this._gitClient.getRefs(repositoryName, this._webContext.project.id, this._getRefFilter("refs/heads/master"), undefined, undefined, undefined, undefined, true)
            .then(refs => {
                return this._gitClient.createPush(
                    {
                    "refUpdates": [{
                        "name": `refs/heads/${data.name}`,
                        "oldObjectId": refs[0].objectId
                    }],
                    "commits": [
                        {
                        "comment": data.name,
                        "changes": [
                            {
                            "changeType": "add",
                            "item": {
                                "path": `/${data.service}/${data.milestone}/${data.name}/${data.name}.ps1`
                            },
                            "newContent": {
                                "content": data.content,
                                "contentType": "rawtext"
                                }
                            }
                        ]
                        }
                    ]
                }, repositoryName, this._webContext.project.id);
            });
    }
    
     /**
      * The refs filter query parameter requires omitting the "refs/" prefix if present. Ex: "heads/myBranchName"
      */
    private _getRefFilter(refName: string): string {
        return (refName.indexOf("refs/") === 0) ? refName.substr("refs/".length) : refName;
    }

    private _getWebContext() {
        return VSS.getWebContext();
    }
}

